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
import { IUser } from "../interface/model/IUser";
import IPager from "../interface/IPager";

export default class ListenerService {

    private static _instance: ListenerService;
    private biz:ListenerBiz;
    private mainlabelService:MainLabelService;
    private userService:UserService;
    private readonly PAGE_SIZE = 20;
    private constructor() {
        this.biz = ListenerBiz.getInstance();
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
    }

    public updateUser(user:IUser){
        const promise = this.userService.update(user);
        promise.then(res=>{
            this.syncMongo(user.id);
        });
    }

    public updateListener(listener:IListener){
        const uid = listener.uid;
        delete listener.uid;
        const promise = ListenerModel.update(listener,{
            where:{
                uid:uid
            }
        });
        promise.then(res=>{
            this.syncMongo(listener.uid);
        });
    }

    private syncMongo(id:number){
        this.findByUserid(id).then(res=>{
            MongoSortFilterModel.create({
                uid:id,
                generalprice:Math.min(res.phoneprice,res.wordprice),
                auth:res.labelids,
                praisepercent:0,
                sex:res.user.sex,
                family:res.family,
                birthday:res.user.birthday,
                edu:res.edu,
                sealtimes:0,
                receivestatus:res.recievestatus,
                labelids:res.labelids
            });
        });
    }

    public findByUserid(id:number){
        return ListenerModel.find({
            include: [{
                model: User,
                as: 'user',
                where: { id:id }
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
            // if(res){
            //     ObjectHelper.mergeChildToSource(res);
            // }
            return Promise.resolve(res);
        });
    }

    public findInUserids(ids:number[]){
        return ListenerModel.findAll({
            include: [{
                model: User,
                as: 'user',
                where: { id:{[Op.in] :ids}}
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

    static createInstance() {
        ListenerService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}