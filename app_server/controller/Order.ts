import { IOrder } from "../interface/model/IOrder";
import * as Bluebird from "bluebird";
import OrderBizService from "../biz/OrderBiz";
import UserService from "./User";
import ErrorMsg from "../model/ErrorMsg";
import { ERole } from "../enum/ERole";
// import { wxPay, recieve } from "../helper/wxPay";
import WxPayHelper from "../helper/wxPayHelper";
import { EOrderStatus } from "../enum/order/EOrderStatus";
import Order from "../model/Order";
import { EPayType } from "../enum/order/EPayType";
import * as express from "express";
import * as Sequelize from "sequelize";
import _ = require("lodash");
import { LogHelper } from "../helper/logHelper";
// import { getClientIp } from "../helper/util";
import { Op } from "sequelize";
import * as moment from "moment";

import { ECompleteType } from "../enum/order/ECompleteType";
import sequelize from "../mysqlSeq";
import CalucateService from "../helper/CalucateService";
import { IPager } from "../interface/IPager";
import User from "../model/User";

export default class OrderService {

    private static _instance: OrderService;

    private biz:OrderBizService;
    private userService:UserService;
    private logHelper:LogHelper;
    private wxPayHelper:WxPayHelper;
    private constructor() {
        this.logHelper = LogHelper.getInstance();
        this.wxPayHelper = WxPayHelper.getInstance();
        this.biz = OrderBizService.getInstance();
        this.userService =  UserService.getInstance();
    }

    private checkPay(orderModel:IOrder){
        const findCurrentUser = this.userService.find(orderModel.uid);
        const findListener = this.userService.find(orderModel.lid);
        return Bluebird.all([findCurrentUser,findListener]).then(datas=>{
            if(!datas[0]||!datas[1]){
                return Bluebird.reject(new ErrorMsg(false,"用户或倾听者不存在"));
            }
            if(datas[1].role!==ERole.Listener){
                return Bluebird.reject(new ErrorMsg(false,"购买对象不是倾听者"));
            }
            const user = datas[0];
            if(orderModel.balance){
                if(!user.money){
                    return Bluebird.reject(new ErrorMsg(false,"用户余额为空"));
                }
                if(user.money<orderModel.balance){
                    return Bluebird.reject(new ErrorMsg(false,"用户余额不足"));
                }
            }
            //都是倾听者验证是否存在反向订单，如果有，则还有未完成订单
            if(datas[0].role===ERole.Listener&&datas[1].role === ERole.Listener){
                this.biz.hasOrder(orderModel.lid,orderModel.uid).then(order=>{
                    if(order){
                        return Bluebird.reject(new ErrorMsg(false,"当前有未完成订单，请查看我的订单"));
                    }
                    return Bluebird.resolve(datas);
                });
            }
            return Bluebird.resolve(datas);
        })
    }

    /**
     * 订单生成
     * @param orderParam 
     */
    create(orderParam:IOrder){
        const checkResult = this.biz.checkOrder(orderParam);
        if(!checkResult.success){
            return Bluebird.reject(checkResult);
        }
        
        const orderModel:IOrder = {
            ip:orderParam.ip,
            useragent:orderParam.useragent,
            uid:orderParam.uid,
            lid:orderParam.lid,
            payprice:orderParam.payprice,
            totalprice:orderParam.totalprice,
            balance:orderParam.balance||0,
            source:orderParam.source,
            servicetype:orderParam.servicetype,
            payservicetime:orderParam.payservicetime,
            uprice:orderParam.uprice,
            comment:orderParam.comment,
            ctime:new Date,
            status:EOrderStatus.Awaiting_Payment,
            paytype:EPayType.WX//默认微信
        };
        return this.checkPay(orderModel).then(datas=>{
            const user = datas[0];
            //启动事务，创建订单和更改余额
            return sequelize.transaction(tran=>{
                const createOrder = Order.create(orderModel,).then(order=>{
                    return {user,order};
                });
                const updateUser = this.userService.update({
                    money:CalucateService.numSub(user.money,orderModel.balance),
                    id:orderModel.uid
                },tran);
                return Bluebird.all([createOrder,updateUser]);
            });
        }).then(orderModel=>{
            const user = orderModel.user;
            const order = orderModel.order;
            return this.wxPayHelper.pay(order.ip,user.weixinid,order.id,order.payprice).then(data=>{
                this.logHelper.errorOrder({
                    body:data,
                    message:"支付获取参数成功"
                });
                return {
                    order:order,
                    jsParam:data,
                }
            },err=>{
                this.logHelper.errorOrder({
                    body:err.message,
                    message:"支付获取参数失败"
                });
                return Promise.reject(err);
            });
        });
        
    }

    /**
     * 订单支付
     * @param orderid 
     */
    pay(userid:number,orderid:number){
        return Order.findById(orderid).then(order=>{
            if(!order){
                return Bluebird.reject(new ErrorMsg(false,"订单不存在"));
            }
            if(order.uid!==userid){
                return Bluebird.reject(new ErrorMsg(false,"用户id与订单用户不一致"));
            }
            return this.checkPay(order).then(orderModel=>{
                const user = orderModel[0];
                return this.wxPayHelper.pay(order.ip,user.weixinid,order.id,order.payprice).then(data=>{
                    this.logHelper.errorOrder({
                        body:data,
                        orderid:order.id,
                        message:"支付获取参数成功"
                    });
                    return {
                        data:order,
                        jsParam:data,
                    }
                },err=>{
                    this.logHelper.errorOrder({
                        body:err.message,
                        orderid:order.id,
                        message:"支付获取参数失败"
                    });
                    return err;
                });
            })
        });
    }

    /**
     * 验证当前两个用户是否有订单
     * @param uid 
     * @param lid 
     */
    public checkHasOrder(uid:number,lid:number){
        //必须是已支付或服务中的订单
        return Order.find({
            where:{
                [Op.or]:[{
                    uid:uid,
                    lid:lid
                },{
                    uid:lid,
                    lid:uid
                }],
                [Op.or]:[{
                    status:EOrderStatus.Paid
                },{
                    status:EOrderStatus.Servicing
                }]
            },
            order: [['ctime']]
        });
    }

    /**
     * 验证订单
     * @param orderid 
     * @param totalfee 
     * @param wxorderid 
     */
    private checkPrice(orderid:number,totalfee:number,wxorderid:string){
        return Order.findById(orderid).then(order=>{
            if(!order){
                return Promise.reject(new ErrorMsg(false,"订单不存在"));
            }

            if(order.payprice===totalfee){
                //更新微信订单号和状态
                return Order.update({
                    status:EOrderStatus.Paid,
                    wxorderid:wxorderid,
                    paidtime:new Date()
                },{
                    where:{
                        id:orderid
                    }
                });
            }else{
                return Promise.reject({
                    totalfee,
                    payprice:order.payprice,
                    ...new ErrorMsg(false,"支付金额与订单金额不一致")
                });
            }
        })
    }

    /**
     * 支付回调成功 NOTE:不用了
     * @param req 
     */
    public recieve(req:express.Request){
        // return recieve(req).then(errorMsg=>{
        //     if(errorMsg.success){
        //         const data = errorMsg.data;
        //         //验证金额
        //         if(!data.total_fee){
        //             this.logHelper.errorOrder({
        //                 ip:getClientIp(req),
        //                 body:data,
        //                 message:"支付金额为空"
        //             });
        //             return Promise.reject(new ErrorMsg(false,""));
        //         }
        //         const totalfee = parseFloat(data.total_fee[0]);
        //         if(_.isNaN(totalfee)){
        //             this.logHelper.errorOrder({
        //                 ip:getClientIp(req),
        //                 body:data,
        //                 message:"支付金额不正确"
        //             });
        //             return Promise.reject(new ErrorMsg(false,"支付金额不正确"));
        //         }
        //         if(!data.out_trade_no||!data.out_trade_no[0]){
        //             this.logHelper.errorOrder({
        //                 ip:getClientIp(req),
        //                 body:data,
        //                 message:"订单号为空"
        //             });
        //             return Promise.reject(new ErrorMsg(false,"订单号为空"));
        //         }
        //         const orderid = parseInt(data.out_trade_no[0]);
        //         if(_.isNaN(orderid)){
        //             this.logHelper.errorOrder({
        //                 ip:getClientIp(req),
        //                 body:data,
        //                 message:"订单号格式不正确"
        //             });
        //             return Promise.reject(new ErrorMsg(false,"订单号格式不正确"));
        //         }
        //         return this.checkPrice(orderid,totalfee,data.transaction_id[0]).then(order=>{
        //             this.logHelper.appendOrder({
        //                 ip:getClientIp(req),
        //                 body:data,
        //                 message:"订单修改成功"
        //             });
        //             return order;
        //         },err=>{
        //             this.logHelper.errorOrder({
        //                 ip:getClientIp(req),
        //                 body:data,
        //                 message:err.message
        //             });
        //             return err;
        //         });
        //     }else{
        //         return Promise.reject(errorMsg);
        //     }
        // });
    }

    /**
     * 使用支付库支付回调
     * @param result 
     */
    public recievePay(result:any){
        if(!result){
            this.logHelper.errorOrder({
                body:result,
                message:"支付返回结果为空"
            });
            return Bluebird.reject(new ErrorMsg(false,"支付返回结果为空"));
        }
        const totalfee = parseFloat(result.total_fee);
        if(_.isNaN(totalfee)){
            this.logHelper.errorOrder({
                body:result,
                message:"支付金额不正确"
            });
            return Bluebird.reject(new ErrorMsg(false,"支付金额不正确"));
        }
        if(!result.out_trade_no){
            this.logHelper.errorOrder({
                body:result,
                message:"订单号为空"
            });
            return Bluebird.reject(new ErrorMsg(false,"订单号为空"));
        }

        const orderid = parseInt(result.out_trade_no);
        if(_.isNaN(orderid)){
            this.logHelper.errorOrder({
                body:result,
                message:"订单号格式不正确"
            });
            return Bluebird.reject(new ErrorMsg(false,"订单号格式不正确"));
        }
        return this.checkPrice(orderid,totalfee,result.transaction_id).then(order=>{
            this.logHelper.appendOrder({
                body:result,
                message:"订单支付成功"
            });
            return order;
        },err=>{
            this.logHelper.errorOrder({
                body:result,
                message:err.message
            });
            return Promise.reject(err);
        });
    }

    /**
     * 退款
     * @param userid 
     * @param orderid 
     */
    public refund(userid:number,orderid:number){
        return Order.findById(orderid).then(order=>{
            if(!order){
                return Promise.reject(new ErrorMsg(false,"订单不存在"));
            }
            if(order.status !== EOrderStatus.Paid){
                return Promise.reject(new ErrorMsg(false,"订单非已支付状态"));
            }
            if(order.uid!==userid){
                return Promise.reject(new ErrorMsg(false,"当前用户和订单不一致"));
            }
            if(order.status===EOrderStatus.Paid){
                return Promise.reject(new ErrorMsg(false,"必须为已支付的订单"));
            }
            if(moment(new Date()).diff(moment(order.paidtime),"year")>1){
                return Promise.reject(new ErrorMsg(false,"退款的订单不能超过一年"));
            }
            return Order.update({
                status:EOrderStatus.RefundAudit,
                srefoundtime:new Date
            },{
                where:{
                    id:orderid
                }
            }).then(res=>{
                this.logHelper.appendOrder({
                    body:res,
                    message:"申请订单退款"
                });
                return res;
            });
            // this.wxPayHelper.refund(orderid,order.payprice).then(data=>{
            //     this.logHelper.appendOrder({
            //         body:data,
            //         message:"订单退款成功"
            //     });
            //     return data;
            // },err=>{
            //     this.logHelper.appendOrder({
            //         body:err,
            //         message:"订单退款失败"
            //     });
            //     return err;
            // });
        });
    }

    /**
     * 更新订单
     * @param userid 
     * @param order 
     */
    private update(userid:number,order:IOrder,tran?: Sequelize.Transaction){
        if(!order.id){
            return Bluebird.reject(new ErrorMsg(false,"订单id非法"));
        }
        const orderid = order.id;
        delete order.id;
        return Order.findById(orderid).then(order=>{
            if(!order){
                return Bluebird.reject(new ErrorMsg(false,"订单不存在"));
            }
            if(order.uid!==userid){
                return Bluebird.reject(new ErrorMsg(false,"订单用户不一致"));
            }
            const updateOpions:Sequelize.UpdateOptions = {
                where:{
                    id:orderid
                }
            };
            if(tran){
                updateOpions.transaction = tran;
            }
            return Order.update(order,updateOpions);
        });
    }

    /**
     * 聊天完成
     * @param orderid 
     */
    public chatComplete(userid:number,orderid:number){
        return Order.findOne({
            where:{
                uid:userid,
                id:orderid
            }
        }).then(order=>{
            if(!order){
                return Promise.reject(new ErrorMsg(false,"未查询到对应的订单"));
            }
            return sequelize.transaction(tran=>{
                const updateOrderPromise = this.update(userid,{
                    status:EOrderStatus.Awaiting_Comment,
                    completetype:ECompleteType.Auto,
                    completedtime:new Date(),
                    id:orderid
                },tran);
                const updateListenerMoney = this.userService.find(userid).then(res=>{
                    if(!res){
                        return Promise.reject(new ErrorMsg(false, "用户不存在"));
                    }
                    return this.userService.update({
                        id:res.id,
                        money:(res.money||0)+order.totalprice
                    },tran);
                });
                return Promise.all([updateOrderPromise,updateListenerMoney]);
            });
        });
        return this.update(userid,{
            status:EOrderStatus.Awaiting_Comment,
            completetype:ECompleteType.Auto,
            completedtime:new Date(),
            id:orderid
        });
    }

    /**
     * 更新服务时长
     * @param userid 
     * @param orderid 
     * @param servicetime 
     */
    public updateServicetime(userid:number,orderid:number,servicedtime:number){
        return Order.findOne({
            where:{
                id:orderid
            }
        }).then(order=>{
            const servicetime = order.servicetime||0;
            let updatedServiceTime = servicetime - servicedtime;
            if(updatedServiceTime<0){
                updatedServiceTime = 0;
            }
            const updatedField:IOrder = {
                servicetime:updatedServiceTime,
                id:orderid
            };
            if(updatedServiceTime===0){
                Object.assign(updatedField,{
                    status:EOrderStatus.Awaiting_Comment,
                    completetype:ECompleteType.Auto,
                    completedtime:new Date(),
                });
            }
            return this.update(userid,updatedField);
        });
    }

    /**
     * 更新订单为服务站
     * @param userid 
     * @param orderid 
     */
    public updateServicing(userid:number,orderid:number){
        return this.update(userid,{
            status:EOrderStatus.Servicing,
            id:orderid
        });
    }

    /**
     * 取消订单
     * @param userid 
     * @param orderid 
     */
    public cancelOrder(userid:number, orderid:number){
        return Order.findOne({
            where:{
                uid:userid,
                id:orderid
            }
        }).then(order=>{
            if(!order){
                return Promise.reject(new ErrorMsg(false,"未查询到对应的订单"));
            }
            if(!(order.status===EOrderStatus.Awaiting_Payment||order.status===EOrderStatus.Paid)){
                return Promise.reject(new ErrorMsg(false, "订单状态不正确"));
            }
            if(order.status === EOrderStatus.Paid){
                const updateBalance = this.userService.find(order.uid).then(user=>{
                    if(!user){
                        return Promise.reject(new ErrorMsg(false, "用户不存在"));
                    }
                    return this.userService.update({
                        id:user.id,
                        money:(user.money||0) + order.totalprice
                    });
                });
                const updateOrder = this.update(userid,{
                    status:EOrderStatus.Cancelled,
                    canceltime:new Date(),
                    id:orderid
                });
                return Promise.all([updateBalance,updateOrder]) as Promise<any>;
            }else{
                return this.update(userid,{
                    status:EOrderStatus.Cancelled,
                    canceltime:new Date(),
                    id:orderid
                });
            }
        });
    }

    /**
     * 获取统计数据
     * @param listenerid 
     */
    public getSummaryData(listenerid:number){
        return Order.find({
            attributes:[
                [Sequelize.fn("COUNT",Sequelize.literal('DISTINCT `uid`')),'ucount'],
                [Sequelize.fn("SUM",Sequelize.literal('`payservicetime`')),'stime']
            ],
            where:{
                lid:listenerid,
                [Sequelize.Op.or]:[{
                    status:EOrderStatus.Completed
                },{
                    status:EOrderStatus.Awaiting_Comment
                }]
            }
        }).then((data:any)=>{
            if(!data.ucount){
                data.setDataValue('ucount',0);
            }
            if(!data.stime){
                data.setDataValue('stime',0);
            }
            return <{ucount:number,stime:number}>data;
        });
    }

    public getSummeryDatas(lids:number[]) {
        return Order.find({
            attributes:[
                [Sequelize.fn("COUNT",Sequelize.literal('DISTINCT `uid`')),'ucount'],
                [Sequelize.fn("SUM",Sequelize.literal('`payservicetime`')),'stime']
            ],
            where:{
                lid:{
                    [Sequelize.Op.in]:lids
                },
                [Sequelize.Op.or]:[{
                    status:EOrderStatus.Completed
                },{
                    status:EOrderStatus.Awaiting_Comment
                }]
            },
            group:'lid'
        }).then((data:any)=>{
            if(!data.ucount){
                data.setDataValue('ucount',0);
            }
            if(!data.stime){
                data.setDataValue('stime',0);
            }
            return <{ucount:number,stime:number}>data;
        });
    }

    /**
     * 获取订单列表
     * @param userid 
     * @param status 
     * @param page 
     */
    public getOrderList(userid:number,status:EOrderStatus|EOrderStatus[],page:IPager={
        start:0,
        limit:20
    }){
        if(!userid){
            return Bluebird.reject(new ErrorMsg(false,"用户id不能为空"));
        }
        let tempStatus:EOrderStatus[] = [];
        if(_.isArray(status)){
            if(!status.length){
                return Bluebird.reject(new ErrorMsg(false,"订单状态不能为空"));
            }
            const isAllIn = status.every(item=>{
                return item in _.values(EOrderStatus)
            });
            if(!isAllIn){
                return Bluebird.reject(new ErrorMsg(false,"订单状态不正确"));
            }
            tempStatus = status;
        }else{
            if(!(status in _.values(EOrderStatus))){
                return Bluebird.reject(new ErrorMsg(false,"订单状态不正确"));
            }
            tempStatus.push(status);
        }
        return Order.findAll({
            where:{
                uid:userid,
                status:{
                    [Op.in]:tempStatus
                }
            },
            limit:page.limit,
            offset:page.start,
            include:[{
                model: User,
                as: "luser",
                required:false
            }]
        });
    }

    static createInstance() {
        OrderService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}