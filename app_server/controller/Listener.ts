import _ = require("lodash");
import * as Bluebird from "bluebird";
import { Op } from "sequelize";
import ListenerModel from "../model/Listener";
import { IListener } from "../interface/model/IListener";
import User from "../model/User";
import ObjectHelper from "../helper/objectHelper";
import MainLabelService from "./MainLabel";
import { IListenLabel } from "../interface/model/IMainLabel";
import { IErrorMsg } from "../interface/IErrorMsg";
import ListenerBiz from "../biz/ListenerBiz";
import sequelize from "../mysqlSeq";
import UserService from "./User";
import ErrorMsg from "../model/ErrorMsg";
import { ERoleStatus } from "../enum/ERoleStatus";
import IPager from "../interface/IPager";
import PriceSetting from "../model/PriceSetting";
import MongoSyncBiz from "../biz/MongoSyncBiz";
import { EListenerLabelStatus } from "../enum/EListenerLabelStatus";
import ListenerPriceMediator from "./ListenerPriceMediator";
import { ERole } from "../enum/ERole";
import BaseDataHelper from "../helper/baseDataHelper";
import { ITreeData } from "../interface/ITreeData";
import { IBaseData } from "../interface/IBaseData";
import { ELabelSType } from "../enum/ELabelType";

export default class ListenerService {

    private static _instance: ListenerService;
    private biz:ListenerBiz;
    private mainlabelService:MainLabelService;
    private userService:UserService;
    private mongoSyncbiz:MongoSyncBiz;
    private pricesettingMediator:ListenerPriceMediator;
    private baseDataHelper:BaseDataHelper;
    private readonly PAGE_SIZE = 20;
    private constructor() {
        this.pricesettingMediator = ListenerPriceMediator.getInstance();
        this.pricesettingMediator.setListener(this);
        this.baseDataHelper = BaseDataHelper.getInstance();
        this.biz = ListenerBiz.getInstance();
        this.mongoSyncbiz = MongoSyncBiz.getInstance(); 
        this.mainlabelService = MainLabelService.getInstance();
        this.userService = UserService.getInstance(this);
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
                listener.user.role = ERole.Listener;
                const updateUserPromise = this.userService.update(listener.user,tran);
                // listener.uid = listener.user.id;
                // delete listener.user;
                const createListenerPromise = ListenerModel.create(listener,{transaction:tran});
                const createDefaultPricePromise = this.pricesettingMediator.createDefaultPrice(listener.uid,{transaction:tran});
                return Bluebird.all([updateUserPromise,createListenerPromise,createDefaultPricePromise]);
            });
        });
    }

    public find(id:number){
        return ListenerModel.findById(id);
    }

    /**
     * 获取带有描述的标签
     * @param labels 
     * @param labeldesc 
     */
    private getLabels(labels:IListenLabel[],labeldesc:string){
        if(labels.length&&labeldesc){
            const descObj = <any[]>ObjectHelper.parseJSON(labeldesc)||[];
            if(descObj&&descObj.length){
                labels.forEach(label=>{
                    const current = descObj.find(item=>item.id===label.id);
                    if(current){
                        label.desc = current.desc;
                        label.lsstatus = current.lsstatus||EListenerLabelStatus.正常;
                    }
                })
            }
        }
        return labels;
    }

    /**
     * 转换标签
     * @param labelids 
     * @param labeldesc 
     * @param hasStatus 是否包含状态（当前用户取不包含状态）
     */
    private parseLabels(labelids:string|number[],labeldesc:string,hasStatus=true){
        labelids = ObjectHelper.parseJSON(<string>labelids)||[];
        let labels:IListenLabel[] = [];
        if(hasStatus){
            labels = <IListenLabel[]>this.mainlabelService.findLabel(<number[]>labelids);
        }else{
            labels = <IListenLabel[]>this.mainlabelService.findLabelNoStatus(<number[]>labelids);
        }
        labels = ObjectHelper.serialize<IListenLabel[]>(labels);
        return this.getLabels(labels,labeldesc);
    }

    /**
     * 转换经历
     * @param labelids 
     * @param labeldesc 
     * @param hasStatus 
     */
    private parseExprience(labelids:string|number[],labeldesc:string,hasStatus=true){
        labelids = ObjectHelper.parseJSON(<string>labelids)||[];
        let labels:IListenLabel[] = [];
        if(hasStatus){
            labels = <IListenLabel[]>this.mainlabelService.findExprience(<number[]>labelids);
        }else{
            labels = <IListenLabel[]>this.mainlabelService.findExprienceNoStatus(<number[]>labelids);
        }
        labels = ObjectHelper.serialize<IListenLabel[]>(labels);
        return this.getLabels(labels,labeldesc);
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
                listener.uid = uid;
                return this.mongoSyncbiz.updateByListener(listener);
            }
            return res;
        });
        return promise;
    }

    public updateListenerById(userid:number,listener:IListener){
        const promise = ListenerModel.update(listener,{
            where:{
                uid:userid
            }
        });
        promise.then((res)=>{
            if(res[0]>0){
                listener.uid = userid;
                return this.mongoSyncbiz.updateByListener(listener);
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

    /**
     * 根据用户id仅获取倾听者
     * @param userid 
     */
    public findOnlyListenerByUserid(userid:number){
        return ListenerModel.find({
            where:{
                uid:userid
            }
        });
    }

    public findByUserid(userid:number){
        return ListenerModel.find({
            include: [{
                model: User,
                as: 'user',
                include:[{
                    model:PriceSetting
                }],
                where: { id:userid }
            }]
        }).then(res=>{
            if(!res||!res.user){
                Bluebird.reject(new ErrorMsg(false,"未查到对应的用户"));
                return;
            }
            const listener = <IListener>ObjectHelper.serialize(res);
            const labels = this.parseLabels(res.labelids,<string>res.labeldesc,false);
            const exps = this.parseExprience(res.expids,<string>res.expdesc,false);
            ObjectHelper.merge(listener,{
                labels,
                exps
            });
            const job = this.baseDataHelper.getJob(listener.job);
            if(job){
                (<any>listener).jobname = (<ITreeData>job).name;
            }
            const edu = this.baseDataHelper.getEdu(listener.edu);
            if(edu){
                (<any>listener).eduname = (<IBaseData>edu).name;
            }
            const family = this.baseDataHelper.getFamily(listener.family);
            if(edu){
                (<any>listener).familyname = (<IBaseData>family).name;
            }
            return Promise.resolve(listener);
        });
    }
    
    public findInUserids(ids:number[]){
        return ListenerModel.findAll({
            include: [{
                model: User,
                as: 'user',
                where: { id:{[Op.in] :ids}},
                include:[{
                    model:PriceSetting
                }],
            }]
        }).then(res=>{
            const listeners = <IListener[]>ObjectHelper.serialize(res);
            listeners.forEach(item=>{
                const labels = this.parseLabels(item.labelids,<string>item.labeldesc);
                const exps = this.parseExprience(item.expids,<string>item.expdesc);
                ObjectHelper.merge(item,{
                    labels:labels,
                    exps
                });
                // if(item){
                //     ObjectHelper.mergeChildToSource(item);
                // }
            });
            return Bluebird.resolve(listeners);
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
            const listeners = <IListener[]>ObjectHelper.serialize(res);
            listeners.forEach(item=>{
                const labels = this.parseLabels(item.labelids,<string>item.labeldesc);
                const exps = this.parseExprience(item.expids,<string>item.expdesc);
                ObjectHelper.merge(item,{
                    labels:labels,
                    exps
                });
                // if(item){
                //     ObjectHelper.mergeChildToSource(item);
                // }
            });
            return Bluebird.resolve(listeners);
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
            ori.descs.push({id:item.id,desc:item.desc,lsstatus:EListenerLabelStatus.审核中});
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

    public deleteLabels(userid:number,labelid:number,stype:ELabelSType){
        return this.findByUserid(userid).then(res=>{
            let isChange = false;
            const temp:any = {};
            if(res&&res.labelids){
                const key = stype ===ELabelSType.Label?"labelids":"expids";
                const keyids = ObjectHelper.parseJSON(<string>res[key])||[];
                if(_.isArray(keyids)){
                    _.remove(keyids,item=>item===labelid);
                }
                temp[key] = JSON.stringify(keyids);
                isChange = true;
            }
            if(res&&res.labeldesc){
                const key = stype ===ELabelSType.Label?"labeldesc":"expdesc";
                const keydescs = ObjectHelper.parseJSON(<string>res[key])||[];
                if(_.isArray(keydescs)){
                    _.remove(keydescs,item=>item.id===labelid);
                }
                temp[key] = JSON.stringify(keydescs);;
                isChange = true;
            }
            if(isChange){
                return this.updateListener({
                    uid:userid,
                    ...temp
                });
            }
        })
    }

    /**
     * 更新经历
     */
    public updateExp(userid:number,exp:IListenLabel){
        if(!exp.id){
            return Bluebird.reject(new ErrorMsg(false,"经历id不能为空"));
        }
        exp.lsstatus = EListenerLabelStatus.审核中;
        return this.findOnlyListenerByUserid(userid).then(listener=>{
            if(!listener){
                return Bluebird.reject(new ErrorMsg(false,"未找到对应用户"))
            }
            const expids:any[] = ObjectHelper.parseJSON(<string>listener.expids)||[];
            const expdesc:any[] = ObjectHelper.parseJSON(<string>listener.expdesc)||[];
            if(expids.indexOf(exp.id)>-1){
                const current = expdesc.find(item=>item.id);
                if(current){
                    Object.assign(current,exp);
                }else{
                    expdesc.push(exp);
                }
            }else{
                expids.push(exp.id);
                expdesc.push(exp);
            }
            return this.updateListener({
                uid:userid,
                expids:JSON.stringify(expids),
                expdesc:JSON.stringify(expdesc)
            });
        });
    }

    static createInstance() {
        ListenerService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}