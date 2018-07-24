"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const OrderBiz_1 = require("../biz/OrderBiz");
const User_1 = require("./User");
const ErrorMsg_1 = require("../model/ErrorMsg");
const ERole_1 = require("../enum/ERole");
const wxPay_1 = require("../helper/wxPay");
const EOrderStatus_1 = require("../enum/order/EOrderStatus");
const Order_1 = require("../model/Order");
const EPayType_1 = require("../enum/order/EPayType");
const _ = require("lodash");
const logHelper_1 = require("../helper/logHelper");
const util_1 = require("../helper/util");
const sequelize_1 = require("sequelize");
class OrderService {
    constructor() {
        this.logHelper = logHelper_1.LogHelper.getInstance();
        this.biz = OrderBiz_1.default.getInstance();
        this.userService = User_1.default.getInstance();
    }
    /**
     * 订单生成
     * @param orderParam
     */
    create(orderParam) {
        const checkResult = this.biz.checkOrder(orderParam);
        if (!checkResult.success) {
            return Bluebird.reject(checkResult);
        }
        const orderModel = {
            ip: orderParam.ip,
            useragent: orderParam.useragent,
            uid: orderParam.uid,
            lid: orderParam.lid,
            payprice: orderParam.payprice,
            totalprice: orderParam.totalprice,
            balance: orderParam.balance || 0,
            source: orderParam.source,
            servicetype: orderParam.servicetype,
            payservicetime: orderParam.payservicetime,
            uprice: orderParam.uprice,
            comment: orderParam.comment,
            ctime: new Date,
            status: EOrderStatus_1.EOrderStatus.Awaiting_Payment,
            paytype: EPayType_1.EPayType.WX //默认微信
        };
        const findCurrentUser = this.userService.find(orderParam.uid);
        const findListener = this.userService.find(orderParam.lid);
        return Bluebird.all([findCurrentUser, findListener]).then(datas => {
            if (!datas[0] || !datas[1]) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "用户或倾听者不存在"));
            }
            if (datas[1].role !== ERole_1.ERole.Listener) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "购买对象不是倾听者"));
            }
            const user = datas[0];
            if (orderModel.balance) {
                if (!user.money) {
                    return Bluebird.reject(new ErrorMsg_1.default(false, "用户余额为空"));
                }
                if (user.money < orderModel.balance) {
                    return Bluebird.reject(new ErrorMsg_1.default(false, "用户余额不足"));
                }
            }
            return Bluebird.resolve(datas);
        }).then(datas => {
            const user = datas[0];
            return Order_1.default.create(orderModel).then(order => {
                return { user, order };
            });
        }).then(orderModel => {
            const user = orderModel.user;
            const order = orderModel.order;
            return wxPay_1.wxPay(user.weixinid, order.id, order.payprice).then(data => {
                return {
                    order: order,
                    jsParam: data.jsParams,
                };
            });
        });
    }
    /**
     * 订单支付
     * @param orderid
     */
    pay(userid, orderid) {
        return Order_1.default.findById(orderid).then(order => {
            if (!order) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "订单不存在"));
            }
            if (order.uid !== userid) {
                return Bluebird.reject(new ErrorMsg_1.default(false, "用户id与订单用户不一致"));
            }
            return this.userService.find(order.uid).then(user => {
                if (!user) {
                    return Bluebird.reject(new ErrorMsg_1.default(false, "用户不存在"));
                }
                return Bluebird.resolve({
                    user,
                    order
                });
            }).then(orderModel => {
                const user = orderModel.user;
                const order = orderModel.order;
                return wxPay_1.wxPay(user.weixinid, order.id, order.payprice).then(data => {
                    return {
                        data: order,
                        jsParam: data.jsParams,
                    };
                });
            });
        });
    }
    /**
     * 验证当前两个用户是否有订单
     * @param uid
     * @param lid
     */
    checkHasOrder(uid, lid) {
        return Order_1.default.find({
            where: {
                [sequelize_1.Op.or]: [{
                        uid: uid,
                        lid: lid
                    }, {
                        uid: lid,
                        lid: uid
                    }]
            }
        });
    }
    /**
     * 验证订单
     * @param orderid
     * @param totalfee
     * @param wxorderid
     */
    checkPrice(orderid, totalfee, wxorderid) {
        return Order_1.default.findById(orderid).then(order => {
            if (!order) {
                return Promise.reject(new ErrorMsg_1.default(false, "订单不存在"));
            }
            else {
                if (order.payprice === totalfee) {
                    //更新微信订单号和状态
                    return Order_1.default.update({
                        status: EOrderStatus_1.EOrderStatus.Paid,
                        wxorderid: wxorderid
                    }, {
                        where: {
                            id: orderid
                        }
                    });
                }
                else {
                    return Promise.reject(Object.assign({ totalfee, payprice: order.payprice }, new ErrorMsg_1.default(false, "支付金额与订单金额不一致")));
                }
            }
        });
    }
    /**
     * 支付回调成功
     * @param req
     */
    recieve(req) {
        return wxPay_1.recieve(req).then(errorMsg => {
            if (errorMsg.success) {
                const data = errorMsg.data;
                //验证金额
                if (!data.total_fee) {
                    this.logHelper.errorOrder({
                        ip: util_1.getClientIp(req),
                        body: data,
                        message: "支付金额为空"
                    });
                    return Promise.reject(new ErrorMsg_1.default(false, ""));
                }
                const totalfee = parseFloat(data.total_fee[0]);
                if (_.isNaN(totalfee)) {
                    this.logHelper.errorOrder({
                        ip: util_1.getClientIp(req),
                        body: data,
                        message: "支付金额不正确"
                    });
                    return Promise.reject(new ErrorMsg_1.default(false, "支付金额不正确"));
                }
                if (!data.out_trade_no || !data.out_trade_no[0]) {
                    this.logHelper.errorOrder({
                        ip: util_1.getClientIp(req),
                        body: data,
                        message: "订单号为空"
                    });
                    return Promise.reject(new ErrorMsg_1.default(false, "订单号为空"));
                }
                const orderid = parseInt(data.out_trade_no[0]);
                if (_.isNaN(orderid)) {
                    this.logHelper.errorOrder({
                        ip: util_1.getClientIp(req),
                        body: data,
                        message: "订单号格式不正确"
                    });
                    return Promise.reject(new ErrorMsg_1.default(false, "订单号格式不正确"));
                }
                return this.checkPrice(orderid, totalfee, data.transaction_id[0]).then(order => {
                    this.logHelper.appendOrder({
                        ip: util_1.getClientIp(req),
                        body: data,
                        message: "订单修改成功"
                    });
                    return order;
                }, err => {
                    this.logHelper.errorOrder({
                        ip: util_1.getClientIp(req),
                        body: data,
                        message: err.message
                    });
                    return err;
                });
            }
            else {
                return Promise.reject(errorMsg);
            }
        });
    }
    static createInstance() {
        OrderService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = OrderService;
