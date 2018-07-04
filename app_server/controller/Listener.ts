// import UserModel from "../model/User";
import ListenerModel from "../model/Listener";
import { IListener } from "../interface/model/IListener";
import * as Bluebird from "bluebird";
import User from "../model/User";
import { Op } from "sequelize";
import ObjectHelper from "../helper/objectHelper";
import MainLabelService from "./MainLabel";
import { IListenLabel } from "../interface/model/IMainLabel";
import { IErrorMsg } from "../interface/IErrorMsg";
import ListenerBiz from "../biz/ListenerBiz";
import sequelize from "../mysqlSeq";
import UserService from "./User";
import ErrorMsg from "../model/ErrorMsg";
import { ERoleStatus } from "../enum/ERoleStatus";
import MongoSortFilterModel from "../model/mongo/MongoSortFilterModel";
import IPager from "../interface/IPager";
import PriceSetting from "../model/PriceSetting";
import MongoSyncBiz from "../biz/MongoSyncBiz";
import _ = require("lodash");

export default class ListenerService {

    private static _instance: ListenerService;
    private biz:ListenerBiz;
    private mainlabelService:MainLabelService;
    private userService:UserService;
    private mongoSyncbiz:MongoSyncBiz
    private readonly PAGE_SIZE = 20;
    private constructor() {
        this.biz = ListenerBiz.getInstance();
        this.mongoSyncbiz = MongoSyncBiz.getInstance(); 
        this.mainlabelService = MainLabelService.getInstance();
        this.userService = UserService.getInstance();
    }

    public bindListener(listenerp:IListener):Bluebird<IErrorMsg>{
        const listener = ObjectHelper.serialize<IListener>(listenerp);
        let result = this.biz.checkBindListenerModel(listener);
        if(!result.success){
            return Bluebird.reject(result);
        }

        const findUserPromise = this.userService.find(listener.uid).then(res=>{
            if(!res){
                return Bluebird.reject(new ErrorMsg(false,"未查到对应账号"));
            }
            return Bluebird.resolve(res);
        });
        const findUserBindPromise = this.findByUserid(listener.uid).then(res=>{
            if(res){
                return Bluebird.reject(new ErrorMsg(false,"当前账号已经是倾听者"));
            }
            return Bluebird.resolve(new ErrorMsg(true));
        })
    
        return Bluebird.all([findUserPromise,findUserBindPromise]).then(res=>{
            return sequelize.transaction(tran=>{
                listener.user.status = ERoleStatus.审核中;
                listener.user.id = listener.uid;
                const updateUserPromise = this.userService.update(listener.user,tran);
                // listener.uid = listener.user.id;
                // delete listener.user;
                const createListenerPromise = ListenerModel.create(listener,{transaction:tran});
                return Bluebird.all([updateUserPromise,createListenerPromise]);
            });
        });
    }

    public find(id:number){
        return ListenerModel.findById(id);
    }

    private parseLabels(labelids:string|number[],labeldesc:string){
        labelids = ObjectHelper.parseJSON(<string>labelids)||[];
        const labels = <IListenLabel[]>this.mainlabelService.findLabel(<number[]>labelids);
        if(labels.length&&labeldesc){
            const descObj = <any[]>ObjectHelper.parseJSON(labeldesc)||[];
            if(descObj&&descObj.length){
                labels.forEach(label=>{
                    const current = descObj.find(item=>item.id===label.id);
                    if(current){
                        label.desc = current.desc;
                    }
                })
            }
        }
        return labels;

    }

    /**
     * 审核
     * @param id 
     */
    public confirm(id:number){
        const promise = User.update({
            status:ERoleStatus.正常
        },{
            where:{
                id:id
            }
        })
        promise.then(res=>{
            this.syncMongo(id);
        });
        return promise;
    }

    public updateListener(listener:IListener){
        const uid = listener.uid;
        delete listener.uid;
        const promise = ListenerModel.update(listener,{
            where:{
                uid:uid
            }
        });
        promise.then((res)=>{
            if(res[0]>0){
                return this.mongoSyncbiz.updateByListener(res[1][0]);
            }
            return res;
        });
        return promise;
    }

    public updateListenById(id:number,listener:IListener){
        const promise = ListenerModel.update(listener,{
            where:{
                uid:id
            }
        });
        promise.then((res)=>{
            if(res[0]>0){
                return this.mongoSyncbiz.updateByListener(res[1][0]);
            }
            return res;
        });
        return promise;
    }

    private syncMongo(uid:number){
        this.findByUserid(uid).then(res=>{
            this.mongoSyncbiz.create(res);
        });
    }

    public findByUserid(id:number){
        return ListenerModel.find({
            include: [{
                model: User,
                as: 'user',
                where: { id:id }
            },{
                model:PriceSetting,
                as:"price"
            }]
        }).then(res=>{
            if(!res||!res.user){
                Bluebird.reject({ message: "未查到对应的用户" });
                return;
            }
            const labels = this.parseLabels(res.labelids,<string>res.labeldesc);
            ObjectHelper.merge(res,{
                labels:labels
            });
            return Promise.resolve(res);
        });
    }
    
    public findInUserids(ids:number[]){
        return ListenerModel.findAll({
            include: [{
                model: User,
                as: 'user',
                where: { id:{[Op.in] :ids}}
            },{
                model:PriceSetting,
                as:"price"
            }]
        }).then(res=>{
            res.forEach(item=>{
                const labels = this.parseLabels(item.labelids,<string>item.labeldesc);
                ObjectHelper.merge(item,{
                    labels:labels
                });
                // if(item){
                //     ObjectHelper.mergeChildToSource(item);
                // }
            });
            return Bluebird.resolve(res);
        });
    }

    public findByName(name:string,page:IPager){
        const tempPage:IPager = {
            start:0,
            limit:this.PAGE_SIZE
        };
        if(page){
            tempPage.start = page.start||0;
            if(page.limit){
                tempPage.limit = page.limit;
            }
        }
        return ListenerModel.findAll({
            offset:page.start,
            limit:page.limit,
            include: [{
                model: User,
                as: 'user',
                where: {
                    [Op.or]:[
                        { nickname:{[Op.like] :name} },
                        { labeldesc:{[Op.like]:name} },
                        { expdesc:{[Op.like]:name} }
                    ]
                }
            }]
        }).then(res=>{
            res.forEach(item=>{
                const labels = this.parseLabels(item.labelids,<string>item.labeldesc);
                ObjectHelper.merge(item,{
                    labels:labels
                });
                // if(item){
                //     ObjectHelper.mergeChildToSource(item);
                // }
            });
            return Bluebird.resolve(res);
        });
    }

    /**
     * 更新标签
     * @param labels 
     * @param userid 
     */
    public updateLabels(labels:IListenLabel[],userid:number){
        if(!userid){
            return Bluebird.reject(new ErrorMsg(false,"用户id不能为空"));
        }
        if(!labels||!labels.length){
            return Bluebird.reject(new ErrorMsg(false,"更新的标签不能为空"));
        }
        const result = labels.filter(item=>!!item.id).reduce((ori,item)=>{
            ori.ids.push(item.id);
            ori.descs.push({id:item.id,desc:item.desc});
            return ori;
        },{
            ids:[],
            descs:[]
        });

        return this.updateListener({
            uid:userid,
            labelids:JSON.stringify(result.ids),
            labeldesc:JSON.stringify(result.descs)
        });
    }

    public deleteLabels(userid:number,labelid:number){
        this.findByUserid(userid).then(res=>{
            let isChange = false;
            if(res&&res.labelids){
                const labelids = ObjectHelper.parseJSON(<string>res.labelids)||[];
                if(_.isArray(labelids)){
                    _.remove(labelids,item=>item===labelid);
                }
                res.labelids = JSON.stringify(labelids);
                isChange = true;
            }
            if(res&&res.labeldesc){
                const labeldescs = ObjectHelper.parseJSON(<string>res.labeldesc)||[];
                if(_.isArray(labeldescs)){
                    _.remove(labeldescs,item=>item.id===labelid);
                }
                res.labeldesc = JSON.stringify(labeldescs);;
                isChange = true;
            }
            if(isChange){
                return this.updateListener({
                    uid:userid,
                    labelids:res.labelids,
                    labeldesc:res.labeldesc
                });
            }
        })
    }

    static createInstance() {
        ListenerService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}