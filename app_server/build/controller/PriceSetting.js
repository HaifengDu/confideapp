"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PriceSetting_1 = require("../model/PriceSetting");
const EPriceType_1 = require("../enum/EPriceType");
const PriceSettingBiz_1 = require("../biz/PriceSettingBiz");
const Bluebird = require("bluebird");
const _ = require("lodash");
const ErrorMsg_1 = require("../model/ErrorMsg");
const EPriceStatus_1 = require("../enum/EPriceStatus");
const CalucateService_1 = require("../helper/CalucateService");
const ListenerPriceMediator_1 = require("./ListenerPriceMediator");
class PriceSettingService {
    constructor() {
        this.listenerMediator = ListenerPriceMediator_1.default.getInstance();
        this.biz = PriceSettingBiz_1.default.getInstance();
        this.listenerMediator.setPriceSetting(this);
    }
    /**
     * 创建默认价格
     * @param userid
     */
    createDefaultPrice(userid, options) {
        const priceList = [];
        // priceList.push({
        //     uid:userid,
        //     type:EPriceType.EWord,
        //     timecircle:EPriceCircle.Fifteen,
        //     price:PriceSettingBiz.WordLimit[EPriceCircle.Fifteen].min,
        //     taxprice:CalucateService.numDiv(PriceSettingBiz.WordLimit[EPriceCircle.Fifteen].min,0.8),
        //     status:EPriceStatus.Enable
        // },{
        //     uid:userid,
        //     type:EPriceType.EWord,
        //     timecircle:EPriceCircle.Thirty,
        //     price:PriceSettingBiz.WordLimit[EPriceCircle.Thirty].min,
        //     taxprice:CalucateService.numDiv(PriceSettingBiz.WordLimit[EPriceCircle.Thirty].min,0.8),
        //     status:EPriceStatus.Enable
        // },{
        //     uid:userid,
        //     type:EPriceType.EWord,
        //     timecircle:EPriceCircle.FortyFive,
        //     price:PriceSettingBiz.WordLimit[EPriceCircle.FortyFive].min,
        //     taxprice:CalucateService.numDiv(PriceSettingBiz.WordLimit[EPriceCircle.FortyFive].min,0.8),
        //     status:EPriceStatus.Enable
        // },{
        //     uid:userid,
        //     type:EPriceType.EWord,
        //     timecircle:EPriceCircle.Sixty,
        //     price:PriceSettingBiz.WordLimit[EPriceCircle.Sixty].min,
        //     taxprice:CalucateService.numDiv(PriceSettingBiz.WordLimit[EPriceCircle.Sixty].min,0.8),
        //     status:EPriceStatus.Enable
        // },{
        //     uid:userid,
        //     type:EPriceType.ECall,
        //     timecircle:PriceSettingBiz.CallMinTime,
        //     price:PriceSettingBiz.CallLimit.min,
        //     taxprice:CalucateService.numDiv(PriceSettingBiz.CallLimit.min,0.8),
        //     status:EPriceStatus.Enable
        // });
        //TODO:计算税额
        priceList.push({
            uid: userid,
            type: EPriceType_1.EPriceType.EWord,
            timecircle: PriceSettingBiz_1.default.CallMinTime,
            price: PriceSettingBiz_1.default.WordLimit.min,
            taxprice: CalucateService_1.default.numDiv(PriceSettingBiz_1.default.WordLimit.min, 0.8),
            status: EPriceStatus_1.EPriceStatus.Enable
        }, {
            uid: userid,
            type: EPriceType_1.EPriceType.ECall,
            timecircle: PriceSettingBiz_1.default.CallMinTime,
            price: PriceSettingBiz_1.default.CallLimit.min,
            taxprice: CalucateService_1.default.numDiv(PriceSettingBiz_1.default.CallLimit.min, 0.8),
            status: EPriceStatus_1.EPriceStatus.Enable
        });
        return PriceSetting_1.default.bulkCreate(priceList, options);
        // PriceSetting.create()
    }
    /**
     * updatePrice
     */
    updatePrice(type, pricesettings, userid) {
        if (!userid) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "用户id不能为空"));
        }
        const types = _.values(EPriceType_1.EPriceType);
        if (types.indexOf(type) === -1) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "价格设置类型非法"));
        }
        let promise;
        let result;
        let checkPromise = Bluebird.resolve(new ErrorMsg_1.default(true));
        switch (type) {
            case EPriceType_1.EPriceType.EWord:
                result = this.biz.checkCallSetting(pricesettings);
                if (!result.success) {
                    promise = Bluebird.reject(result);
                }
                else {
                    const isAllDisable = pricesettings.every(item => item.status === EPriceStatus_1.EPriceStatus.Disable);
                    if (isAllDisable) {
                        checkPromise = PriceSetting_1.default.find({
                            where: {
                                uid: userid,
                                type: EPriceType_1.EPriceType.ECall
                            }
                        }).then(res => {
                            if (res && res.status === EPriceStatus_1.EPriceStatus.Disable) {
                                return Bluebird.reject(new ErrorMsg_1.default(false, "不能全部禁用通话和文字服务"));
                            }
                            return Bluebird.resolve(new ErrorMsg_1.default(true));
                        });
                    }
                    promise = checkPromise.then(res => {
                        return this.listenerMediator.checkChangePriceMaxCount(userid, type);
                    }).then(res => {
                        return Bluebird.all(pricesettings.map(item => PriceSetting_1.default.update(item, { where: { id: item.id } }))).then(res => {
                            return this.listenerMediator.syncMinPrice(userid, Math.min.apply(null, pricesettings.map(item => item.taxprice)), type);
                        });
                    });
                }
                break;
            case EPriceType_1.EPriceType.ECall:
                result = this.biz.checkCallSetting(pricesettings);
                if (!result.success) {
                    promise = Bluebird.reject(result);
                }
                else {
                    if (pricesettings[0].status === EPriceStatus_1.EPriceStatus.Disable) {
                        checkPromise = PriceSetting_1.default.findAll({
                            where: {
                                uid: userid,
                                type: EPriceType_1.EPriceType.EWord
                            }
                        }).then(res => {
                            const isAllDisable = res.every(item => item.status === EPriceStatus_1.EPriceStatus.Disable);
                            if (isAllDisable) {
                                return Bluebird.reject(new ErrorMsg_1.default(false, "不能全部禁用通话和文字服务"));
                            }
                            return Bluebird.resolve(new ErrorMsg_1.default(true));
                        });
                    }
                    promise = checkPromise.then(res => {
                        return this.listenerMediator.checkChangePriceMaxCount(userid, type);
                    }).then(res => {
                        return PriceSetting_1.default.update(pricesettings[0], { where: { id: pricesettings[0].id } }).then(res => {
                            return this.listenerMediator.syncMinPrice(userid, pricesettings[0].taxprice, type);
                        });
                    });
                }
                break;
            default:
                promise = Bluebird.reject(new ErrorMsg_1.default(false, "价格设置类型非法"));
                break;
        }
        return promise;
    }
    /**
     * 获取价格
     * @param type
     * @param userid
     */
    getPrice(type, userid) {
        return PriceSetting_1.default.findAll({
            where: {
                uid: userid,
                type
            }
        });
    }
    static createInstance() {
        PriceSettingService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = PriceSettingService;
