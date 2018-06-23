// import UserModel from "../model/User";
import ListenerModel from "../model/Listener";
import { IListener } from "../interface/model/IListener";
import * as Bluebird from "bluebird";
import User from "../model/User";
import { Op } from "sequelize";
import ObjectHelper from "../helper/objectHelper";
import MainLabelService from "./MainLabel";

const edu = require("../../config/edu.json");

export default class ListenerService {

    private static _instance: ListenerService;
    private mainlabelService:MainLabelService;
    private constructor() {
        this.mainlabelService = MainLabelService.getInstance();
    }

    private create(user:IListener){
        return ListenerModel.create(user);
    }

    public find(id:number){
        return ListenerModel.findById(id);
    }

    public findByUserid(id:number){
        return ListenerModel.find({
            include: [{
                model: User,
                as: 'user',
                where: { id:id }
            }]
        }).then(res=>{
            if(!res.user){
                Bluebird.reject({message:"未查到对应的用户"});
                return;
            }
            if(res.maintitles){
                const labelids = ObjectHelper.parseJSON(res.maintitles)||[];
                const labels = this.mainlabelService.findLabelByUser(labelids,res.id);
                ObjectHelper.merge(res,{
                    labels:labels
                });
            }
            if(res){
                ObjectHelper.mergeChildToSource(res);
            }
            return Promise.resolve(res);
        });
    }

    public delete(id:number){
        return ListenerModel.update({
            status:-1
        },{
            where:{
                id:id
            }
        });
    }

    static createInstance() {
        ListenerService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}