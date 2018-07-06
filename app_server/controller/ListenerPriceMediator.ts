import PriceSettingService from "./PriceSetting";
import ListenerService from "./Listener";
import * as Sequelize from "sequelize";
import PriceSettingBiz from "../biz/PriceSettingBiz";
import * as Bluebird from "bluebird";
import _ = require("lodash");
import ErrorMsg from "../model/ErrorMsg";
import EPriceType from "../enum/EPriceType";

export default class ListenerPriceMediator{
    private static _instance: ListenerPriceMediator;
    private priceSettingService:PriceSettingService;
    private listenerService:ListenerService;
    private constructor() {

    }

    public setPriceSetting(priceSettingService:PriceSettingService){
        console.log("已设置价格");
        this.priceSettingService = priceSettingService;
    }

    public setListener(ListenerService: ListenerService){
        console.log("已设置倾听者服务");
        this.listenerService = ListenerService
    }

    public createDefaultPrice(userid:number,options?:Sequelize.BulkCreateOptions){
        return this.priceSettingService.createDefaultPrice(userid,options);
    }

    /**
     * 同步最小价
     * @param uid 
     * @param price 
     */
    public syncMinPrice(uid:number,price:number,type:EPriceType){
        return this.listenerService.findByUserid(uid).then((res:any)=>{
            const minprice = Math.min(price,res.minprice||0);
            const updateAttrs:any = {};
            if(minprice!==res.minprice){
                updateAttrs.minprice = minprice;
            }
            let countkey = "wchcount";
            let lastchangeDate = "wchlastdate";
            if(type===EPriceType.ECall){
                countkey="cchcount";
                lastchangeDate="cchlastdate";
            }
            if(!res[lastchangeDate]){
                //第一次没有日期
                res[lastchangeDate] = new Date();
            }

            updateAttrs[countkey] = res[countkey]||0;
            //如果在当前月 更新最后时间和累加次数
            if(this.compareDate(res[lastchangeDate])){
                updateAttrs[countkey]++;
            }else{
                updateAttrs[countkey] = 0;
            }
            updateAttrs[lastchangeDate] = new Date();
            return this.listenerService.updateListenerById(res.id,updateAttrs);
        });
    }

    public checkChangePriceMaxCount(uid:number,type:EPriceType){
        return this.listenerService.findByUserid(uid).then(res=>{
            let countkey = "wchcount";
            let lastchangeDate = "wchlastdate";
            if(type===EPriceType.ECall){
                countkey="cchcount";
                lastchangeDate="cchlastdate";
            }
            if(res[countkey]>PriceSettingBiz.MaxChangeCount&&this.compareDate(res[lastchangeDate])){
                return Bluebird.reject(new ErrorMsg(false,`当月修改修改价格不能超过${PriceSettingBiz.MaxChangeCount}次`));
            }
            return Bluebird.resolve(res);
        });
    }

    /**
     * 最后修改时间是否在当前月
     * @param last 
     */
    private compareDate(last:Date){
        if(!last){
            return true;
        }
        if(_.isNaN(last.getFullYear())){
            return true;
        }
        const now = new Date();
        const lyear = last.getFullYear();
        const nyear = now.getFullYear();
        const lmonth = last.getMonth();
        const nmonth = now.getMonth();
        //当前年月一样 
        return lyear===nyear&&lmonth===nmonth;
        
    }

    static createInstance() {
        ListenerPriceMediator.getInstance();
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}