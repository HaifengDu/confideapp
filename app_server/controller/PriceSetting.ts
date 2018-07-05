import PriceSetting from '../model/PriceSetting';
import { EPriceType } from '../enum/EPriceType';
import { IPriceSetting } from '../interface/model/IPriceSetting';
import PriceSettingBiz from '../biz/PriceSettingBiz';
import * as Bluebird from "bluebird";
import _ = require('lodash');
import ErrorMsg from '../model/ErrorMsg';
import { EPriceStatus } from '../enum/EPriceStatus';
import ListenerService from './Listener';
import EPriceCircle from '../enum/EPriceCircle';
import CalucateService from '../helper/CalucateService';
import * as Sequelize from "sequelize";
export default class PriceSettingService {

    private static _instance: PriceSettingService;

    private biz:PriceSettingBiz;
    private listenerService:ListenerService;

    private constructor() {
        this.listenerService = ListenerService.getInstance();
        this.biz =  PriceSettingBiz.getInstance();
    }

    /**
     * 创建默认价格
     * @param userid 
     */
    public createDefaultPrice(userid:number,options?:Sequelize.BulkCreateOptions){
        const priceList:IPriceSetting[] = [];
        priceList.push({
            uid:userid,
            type:EPriceType.EWord,
            timecircle:EPriceCircle.Fifteen,
            price:PriceSettingBiz.WordLimit[EPriceCircle.Fifteen].min,
            taxprice:CalucateService.numDiv(PriceSettingBiz.WordLimit[EPriceCircle.Fifteen].min,0.8),
            status:EPriceStatus.Enable
        },{
            uid:userid,
            type:EPriceType.EWord,
            timecircle:EPriceCircle.Thirty,
            price:PriceSettingBiz.WordLimit[EPriceCircle.Thirty].min,
            taxprice:CalucateService.numDiv(PriceSettingBiz.WordLimit[EPriceCircle.Thirty].min,0.8),
            status:EPriceStatus.Enable
        },{
            uid:userid,
            type:EPriceType.EWord,
            timecircle:EPriceCircle.FortyFive,
            price:PriceSettingBiz.WordLimit[EPriceCircle.FortyFive].min,
            taxprice:CalucateService.numDiv(PriceSettingBiz.WordLimit[EPriceCircle.FortyFive].min,0.8),
            status:EPriceStatus.Enable
        },{
            uid:userid,
            type:EPriceType.EWord,
            timecircle:EPriceCircle.Sixty,
            price:PriceSettingBiz.WordLimit[EPriceCircle.Sixty].min,
            taxprice:CalucateService.numDiv(PriceSettingBiz.WordLimit[EPriceCircle.Sixty].min,0.8),
            status:EPriceStatus.Enable
        },{
            uid:userid,
            type:EPriceType.ECall,
            timecircle:PriceSettingBiz.CallMinTime,
            price:PriceSettingBiz.CallLimit.min,
            taxprice:CalucateService.numDiv(PriceSettingBiz.CallLimit.min,0.8),
            status:EPriceStatus.Enable
        });
        return PriceSetting.bulkCreate(priceList,options);
        // PriceSetting.create()
    }

    /**
     * updatePrice
     */
    public updatePrice(type:EPriceType,pricesettings:IPriceSetting[],userid:number) {
        if(!userid){
            return Bluebird.reject(new ErrorMsg(false,"用户id不能为空"));
        }
        const types = _.values(EPriceType);
        if(types.indexOf(<any>type)===-1){
            return Bluebird.reject(new ErrorMsg(false,"价格设置类型非法"));
        }
        let promise:Bluebird<any>;
        let result:ErrorMsg;
        let checkPromise:Bluebird<ErrorMsg> = Bluebird.resolve(new ErrorMsg(true));
        switch(type){
            case EPriceType.EWord:
                result = this.biz.checkWordSetting(pricesettings);
                if(!result.success){
                    promise = Bluebird.reject(result);
                }else{
                    const isAllDisable = pricesettings.every(item=>item.status===EPriceStatus.Disable);
                    if(isAllDisable){
                        checkPromise = PriceSetting.find({
                            where:{
                                uid:userid,
                                type:EPriceType.ECall
                            }
                        }).then(res=>{
                            if(res&&res.status===EPriceStatus.Disable){
                                return Bluebird.reject(new ErrorMsg(false,"不能全部禁用通话和文字服务"));
                            }
                            return Bluebird.resolve(new ErrorMsg(true)); 
                        });
                    }
                    promise = checkPromise.then(res=>{
                        if(res.success){
                           return Bluebird.all(pricesettings.map(item=>PriceSetting.update(item))).then(res=>{
                                return this.syncMinPrice(userid,Math.min.apply(null,pricesettings.map(item=>item.price)));
                           });
                        }
                        return Bluebird.reject(res);
                    });
                }
            break;
            case EPriceType.ECall:
                result = this.biz.checkCallSetting(pricesettings);
                if(!result.success){
                    promise = Bluebird.reject(result);
                }else{
                    if(pricesettings[0].status===EPriceStatus.Disable){
                        checkPromise = PriceSetting.findAll({
                            where:{
                                uid:userid,
                                type:EPriceType.EWord
                            }
                        }).then(res=>{
                            const isAllDisable =res.every(item=>item.status===EPriceStatus.Disable);
                            if(isAllDisable){
                                return Bluebird.reject(new ErrorMsg(false,"不能全部禁用通话和文字服务"));
                            }
                            return Bluebird.resolve(new ErrorMsg(true)); 
                        });
                    }
                    promise = checkPromise.then(res=>{
                        if(res.success){
                            return PriceSetting.update(pricesettings[0]).then(res=>{
                                return this.syncMinPrice(userid,pricesettings[0].price);
                            });
                         }
                         return Bluebird.reject(res);
                    });
                }
            break;
            default:
                promise = Bluebird.reject(new ErrorMsg(false,"价格设置类型非法"));
            break;
        }
        return promise;
    }

    /**
     * 获取价格
     * @param type 
     * @param userid 
     */
    public getPrice(type:EPriceCircle,userid:number){
        return PriceSetting.findAll({
            where:{
                uid:userid,
                type
            }
        });
    }

    /**
     * 同步最小价
     * @param uid 
     * @param price 
     */
    private syncMinPrice(uid:number,price:number){
        return this.listenerService.findByUserid(uid).then(res=>{
            if(res){
                const minprice = Math.min(price,res.minprice);
                if(minprice!==res.minprice){
                    this.listenerService.updateListenerById(res.id,{
                        minprice:minprice
                    });
                }
            }
        })
    }

    static createInstance() {
        PriceSettingService.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

}