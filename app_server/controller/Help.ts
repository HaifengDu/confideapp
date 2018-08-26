import { IHelp } from "../interface/model/IHelp";
import {Op} from "Sequelize";
import ErrorMsg from "../model/ErrorMsg";
import UserService from "./User";
import * as Bluebird from "bluebird";
import CalucateService from "../helper/CalucateService";
import sequelize from "../mysqlSeq";
import Help from "../model/Help";
import { IPager } from "../interface/IPager";
import HelpRecieveService from "./HelpRecieve";
import { EHelpStatus } from "../enum/EHelpStatus";
import User from "../model/User";

export default class HelpService {

    private static _instance: HelpService;
    private userService:UserService;
    private helpRecieve:HelpRecieveService;
    private constructor() {
        this.userService = UserService.getInstance();
        this.helpRecieve = HelpRecieveService.getInstance();
    }

    create(help:IHelp){
        if(!help){
            return Bluebird.reject(new ErrorMsg(false,"求助不能为空"));
        }
        if(!help.uid){
            return Bluebird.reject(new ErrorMsg(false,"用户不能为空"));
        }
        if(!help.content){
            return Bluebird.reject(new ErrorMsg(false,"求助内容不能为空"));
        }
        if(!help.labelid){
            return Bluebird.reject(new ErrorMsg(false,"标签不能为空"));
        }
        if(!help.money){
            return Bluebird.reject(new ErrorMsg(false,"金额不能为空"));
        }
        return this.userService.find(help.uid).then(user=>{
            if(!user){
                return Bluebird.reject(new ErrorMsg(false,"未找到用户"))
            }
            if(!user.money||user.money<help.money){
                return Bluebird.reject(new ErrorMsg(false,"用户余额不足"));
            }
            const money = CalucateService.numSub(user.money,help.money);
            return sequelize.transaction(tran=>{
                const createPromise = Help.create(help,{
                    transaction:tran
                });
                const updatePromise = this.userService.update({
                    id:user.id,
                    money,
                },tran);
                return Promise.all([createPromise,updatePromise]);
            });
        });
    }

    public getList(labelid:number,page:IPager){
        if(!labelid){
            return Bluebird.reject(new ErrorMsg(false,"标签id不能为空"));
        }
        return Help.findAll({
            offset:page.start,
            limit:page.limit,
            where:{
                labelid,
                status:{
                    [Op.ne]:EHelpStatus.删除
                }
            },
            include:[
                {
                    model:User,
                    as: 'user',
                }
            ]
        }).then(res=>{
            const recieveids = res.filter(item=>item.status===EHelpStatus.关闭&&item.recieveid).map(item=>item.recieveid);
            if(recieveids.length){
               return this.helpRecieve.getByids(recieveids).then(recieves=>{
                    res.forEach(item=>{
                        if(item.recieveid){
                            item.accept = recieves.find(model=>model.id===item.recieveid)
                        }
                    });
                    return res;
               });
            }
            return res;
        });
    }

    static createInstance() {
        HelpService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}