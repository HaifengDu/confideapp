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

const edu = require("../../config/edu.json");

export default class ListenerService {

    private static _instance: ListenerService;
    private biz:ListenerBiz;
    private mainlabelService:MainLabelService;
    private userService:UserService;
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
                const updateUserPromise = this.userService.update(listener.user,tran);
                // listener.uid = listener.user.id;
                // delete listener.user;
                const createListenerPromise = ListenerModel.create(listener,{transaction:tran});
                return Bluebird.all([updateUserPromise,createListenerPromise]);
            });
        });
    }

    private create(user:IListener){
        return ListenerModel.create(user);
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
            const labels = this.parseLabels(res.labelids,res.labeldesc);
            ObjectHelper.merge(res,{
                labels:labels
            });
            if(res){
                ObjectHelper.mergeChildToSource(res);
            }
            return Promise.resolve(res);
        });
    }

    static createInstance() {
        ListenerService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}