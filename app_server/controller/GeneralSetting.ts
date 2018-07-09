// tslint:disable-next-line:interface-name
interface Date{
    format(f:string):string
}
import { IGeneralSetting } from "../interface/model/IGeneralSetting";
import GeneralSetting from "../model/GeneralSetting";
import * as Bluebird from "bluebird";
import ErrorMsg from "../model/ErrorMsg";
import _ = require("lodash");
import { EGeneralStatus } from "../enum/EGeneralStatus";
import ListenerService from "./Listener";
import MongoHomeClickRate from "../model/mongo/MongoHomeClickRate";
import { Query } from "mongoose";
import CalucateService from "../helper/CalucateService";

/**
 * 推广设置
 */
export default class GeneralSettingService {

    private static _instance: GeneralSettingService;

    private listenerService:ListenerService;
    private constructor() {
        this.listenerService = ListenerService.getInstance();
    }

    public setGeneral(generalSetting:IGeneralSetting){
        if(!generalSetting.uid){
            return Bluebird.reject(new ErrorMsg(false,"用户uid不能为空"));
        }
        if(!_.isNumber(generalSetting.price)||!generalSetting.price){
            return Bluebird.reject(new ErrorMsg(false,"价格参数非法"));
        }
        
        if('limitprice' in generalSetting&&!_.isNumber(generalSetting.limitprice)){
            return Bluebird.reject(new ErrorMsg(false,"推广限制必须是数字"));
        }
        if('limitprice' in generalSetting&&generalSetting.limitprice<generalSetting.price){
            return Bluebird.reject(new ErrorMsg(false,"推广限制必须大于等于设置的推广价格"));
        }

        this.listenerService.findByUserid(generalSetting.uid).then(res=>{
            if(!res){
                return Bluebird.reject(new ErrorMsg(false,"未找到对应用户"));
            }
            if(res.money<generalSetting.price){
                return Bluebird.reject(new ErrorMsg(false,"当前余额不足"));
            }
            return Bluebird.resolve(res);
        }).then(res=>{
            //默认启用
            generalSetting.status = EGeneralStatus.Enable;
            return GeneralSetting.find({
                where:{
                    uid:generalSetting.uid
                }
            }).then(res=>{
                if(res){
                    return GeneralSetting.update(generalSetting,{
                        where:{
                            uid:generalSetting.uid
                        }
                    }).then(res=>{
                        return generalSetting;
                    });
                }
                return GeneralSetting.create(generalSetting);
            });
        });
    }

    /**
     * 点击后验证推广
     * @param pid 倾诉者id
     * @param lid 倾听者id
     */
    public checkGeneral(pid:number,lid:number):Promise<any>{
        if(pid===lid){
            return Promise.resolve(new ErrorMsg(true));
        }
        return MongoHomeClickRate.findOne({
            pid:pid,
            lid:lid
        }).then(res=>{
            let promise:Promise<any>|Query<any> = null;
            if(res){
                //当前点击过
                if((<any>res.ldate).format("yyyy-MM-dd")===(<any>new Date()).format('yyyy-MM-dd')){
                    return Promise.resolve<any>(new ErrorMsg(true));
                }
                promise = MongoHomeClickRate.update({
                    pid:pid,
                    lid:lid
                },{
                    ldate:new Date()
                });
            }else{
                promise = <Promise<any>>MongoHomeClickRate.create({
                    pid:pid,
                    lid:lid,
                    ldate:new Date()
                });
            }
            return promise;
        }).then(res=>{
            const findUserPromise = this.listenerService.findByUserid(lid);
            const findGeneralPromise = GeneralSetting.find({
                where:{
                    uid:lid
                }
            });
            return Bluebird.all([findUserPromise,findGeneralPromise]).then(resuls=>{
                const listener = resuls[0];
                const generalSetting = resuls[1];
                const restMoney = CalucateService.numSub(listener.money,generalSetting.price);
                const dayprice = CalucateService.numAdd(generalSetting.dayprice,generalSetting.price);
                let promises:Bluebird<any>[]=[];
                if(restMoney<generalSetting.price){
                    promises.push(GeneralSetting.update({
                        dayprice,
                        status:EGeneralStatus.Disable
                    }));
                }else{
                    /**
                     * 如果设置当日价格限制
                     * 判断当日的推广费用是否小于设置的限制
                     */
                    if(generalSetting.limitprice>0){
                        const dayRestPrice = generalSetting.limitprice-dayprice;
                        if(dayRestPrice<generalSetting.price){
                            promises.push(GeneralSetting.update({
                                dayprice,
                                status:EGeneralStatus.DayDisable
                            }));
                        }else{
                            promises.push(GeneralSetting.update({
                                dayprice
                            }));
                        }
                    }else{
                        promises.push(GeneralSetting.update({
                            dayprice
                        }));
                    }
                }
                listener.money = CalucateService.numSub(listener.money,generalSetting.price);
                promises.push(this.listenerService.updateListener(listener));
                return Promise.all(promises);
            });
        });
    }

    static createInstance() {
        GeneralSettingService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}