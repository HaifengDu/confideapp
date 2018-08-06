"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ErrorMsg_1 = require("../model/ErrorMsg");
const EPriceType_1 = require("../enum/EPriceType");
const CalucateService_1 = require("../helper/CalucateService");
class PriceSettingBiz {
    constructor() {
    }
    /**
     * 获取含税价格
     * @param price
     */
    static getTaxPrice(price) {
        return CalucateService_1.default.numMulti(price, this.tax);
    }
    /**
     * 价格设置验证，都走验证通话
     */
    checkPriceSetting(pricesettings) {
        return this.checkCallSetting(pricesettings);
    }
    /**
     * 文字设置价格验证
     * @param pricesettings
     */
    // public checkWordSetting(pricesettings:IPriceSetting[]){
    //     //验证
    //     if(!pricesettings||!_.isArray(pricesettings)||!pricesettings.length){
    //         return new ErrorMsg(false,"价格设置不能为空");
    //     }
    //     if(!this.checkCircle(pricesettings)){
    //         return new ErrorMsg(false,"定价时间非法");
    //     }
    //     const limitResult = this.checkLimit(pricesettings);
    //     if(!limitResult.success){
    //         return limitResult;
    //     }
    //     return new ErrorMsg(true);
    // }
    /**
     * 通话价格设置验证
     * @param pricesettings
     */
    checkCallSetting(pricesettings) {
        if (!pricesettings || !_.isArray(pricesettings) || !pricesettings.length) {
            return new ErrorMsg_1.default(false, "价格设置不能为空");
        }
        if (pricesettings.length !== 1) {
            return new ErrorMsg_1.default(false, "只能设置单一通话价格");
        }
        const timecircle = pricesettings[0].timecircle;
        if (!_.isNumber(timecircle) || _.isNaN(parseFloat(timecircle))) {
            return new ErrorMsg_1.default(false, "时长是非法数字");
        }
        if (pricesettings[0].type === EPriceType_1.EPriceType.ECall && timecircle < PriceSettingBiz.CallMinTime) {
            return new ErrorMsg_1.default(false, `时长必须大于等于${PriceSettingBiz.CallMinTime}分钟`);
        }
        if (pricesettings[0].type === EPriceType_1.EPriceType.EWord && timecircle < PriceSettingBiz.WordMinTime) {
            return new ErrorMsg_1.default(false, `服务数量必须大于等于${PriceSettingBiz.CallMinTime}调`);
        }
        const limit = pricesettings[0].type === EPriceType_1.EPriceType.ECall ? PriceSettingBiz.CallLimit : PriceSettingBiz.WordLimit;
        const result = this.simpleCheck(pricesettings[0], limit);
        if (!result.success) {
            return result;
        }
        //计算税额
        pricesettings.forEach(item => {
            item.taxprice = PriceSettingBiz.getTaxPrice(item.price);
        });
        return new ErrorMsg_1.default(true);
    }
    // private checkLimit(pricesettings:IPriceSetting[]){
    //     let result = new ErrorMsg(true);
    //     for(let i=0,l=pricesettings.length;i<l;i++){
    //         const current = pricesettings[i];
    //         const limit = PriceSettingBiz.WordLimit[current.timecircle];
    //         if(!limit){
    //             result = new ErrorMsg(false,"价格限制非法");
    //             break;
    //         }
    //         result = this.simpleCheck(current,limit);
    //         if(!result.success){
    //             break;
    //         }
    //     }
    //     return result;
    // }
    simpleCheck(pricesetting, limit) {
        if (!pricesetting.id || !_.isNumber(pricesetting.id)) {
            return new ErrorMsg_1.default(false, "id不能为空");
        }
        if (!_.isNumber(pricesetting.price) || _.isNaN(parseFloat(pricesetting.price))) {
            return new ErrorMsg_1.default(false, "价格是非法数字");
        }
        if (pricesetting.price < limit.min || pricesetting.price > limit.max) {
            return new ErrorMsg_1.default(false, "价格非法");
        }
        return new ErrorMsg_1.default(true);
    }
    // private checkCircle(pricesettings:IPriceSetting[]){
    //     let result = true;
    //     const circleKeys = _.values(EPriceCircle);
    //     const length = pricesettings.filter(item=>circleKeys.indexOf(<any>item.timecircle)===-1).length;
    //     return length===0;
    // }
    static createInstance() {
        PriceSettingBiz.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
// public static readonly WordLimit = {
//     [EPriceCircle.Fifteen]:{
//         min:5,
//         max:100
//     },
//     [EPriceCircle.Thirty]:{
//         min:5,
//         max:200
//     },
//     [EPriceCircle.FortyFive]:{
//         min:5,
//         max:300
//     },
//     [EPriceCircle.Sixty]:{
//         min:5,
//         max:400
//     }
// }
PriceSettingBiz.tax = 0.066;
PriceSettingBiz.CallLimit = {
    min: 0.6,
    max: 20
};
//毎5条的范围为0.25元至100元
PriceSettingBiz.WordLimit = {
    min: 0.05,
    max: 20
};
PriceSettingBiz.CallMinTime = 15;
PriceSettingBiz.WordMinTime = 5;
/**
 * 当月最多修改次数
 */
PriceSettingBiz.MaxChangeCount = 3;
exports.default = PriceSettingBiz;
