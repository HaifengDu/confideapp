"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PriceSetting_1 = require("../model/PriceSetting");
const EPriceType_1 = require("../enum/EPriceType");
const PriceSettingBiz_1 = require("../biz/PriceSettingBiz");
const Bluebird = require("bluebird");
const _ = require("lodash");
const ErrorMsg_1 = require("../model/ErrorMsg");
const EPriceStatus_1 = require("../enum/EPriceStatus");
const Listener_1 = require("./Listener");
const EPriceCircle_1 = require("../enum/EPriceCircle");
const CalucateService_1 = require("../helper/CalucateService");
class PriceSettingService {
    constructor() {
        this.listenerService = Listener_1.default.getInstance();
        this.biz = PriceSettingBiz_1.default.getInstance();
    }
    /**
     * 创建默认价格
     * @param userid
     */
    createDefaultPrice(userid, options) {
        const priceList = [];
        priceList.push({
            uid: userid,
            type: EPriceType_1.EPriceType.EWord,
            timecircle: EPriceCircle_1.default.Fifteen,
            price: PriceSettingBiz_1.default.WordLimit[EPriceCircle_1.default.Fifteen].min,
            taxprice: CalucateService_1.default.numDiv(PriceSettingBiz_1.default.WordLimit[EPriceCircle_1.default.Fifteen].min, 0.8),
            status: EPriceStatus_1.EPriceStatus.Enable
        }, {
            uid: userid,
            type: EPriceType_1.EPriceType.EWord,
            timecircle: EPriceCircle_1.default.Thirty,
            price: PriceSettingBiz_1.default.WordLimit[EPriceCircle_1.default.Thirty].min,
            taxprice: CalucateService_1.default.numDiv(PriceSettingBiz_1.default.WordLimit[EPriceCircle_1.default.Thirty].min, 0.8),
            status: EPriceStatus_1.EPriceStatus.Enable
        }, {
            uid: userid,
            type: EPriceType_1.EPriceType.EWord,
            timecircle: EPriceCircle_1.default.FortyFive,
            price: PriceSettingBiz_1.default.WordLimit[EPriceCircle_1.default.FortyFive].min,
            taxprice: CalucateService_1.default.numDiv(PriceSettingBiz_1.default.WordLimit[EPriceCircle_1.default.FortyFive].min, 0.8),
            status: EPriceStatus_1.EPriceStatus.Enable
        }, {
            uid: userid,
            type: EPriceType_1.EPriceType.EWord,
            timecircle: EPriceCircle_1.default.Sixty,
            price: PriceSettingBiz_1.default.WordLimit[EPriceCircle_1.default.Sixty].min,
            taxprice: CalucateService_1.default.numDiv(PriceSettingBiz_1.default.WordLimit[EPriceCircle_1.default.Sixty].min, 0.8),
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
                result = this.biz.checkWordSetting(pricesettings);
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
                        if (res.success) {
                            return Bluebird.all(pricesettings.map(item => PriceSetting_1.default.update(item))).then(res => {
                                return this.syncMinPrice(userid, Math.min.apply(null, pricesettings.map(item => item.price)));
                            });
                        }
                        return Bluebird.reject(res);
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
                        if (res.success) {
                            return PriceSetting_1.default.update(pricesettings[0]).then(res => {
                                return this.syncMinPrice(userid, pricesettings[0].price);
                            });
                        }
                        return Bluebird.reject(res);
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
    /**
     * 同步最小价
     * @param uid
     * @param price
     */
    syncMinPrice(uid, price) {
        return this.listenerService.findByUserid(uid).then(res => {
            if (res) {
                const minprice = Math.min(price, res.minprice);
                if (minprice !== res.minprice) {
                    this.listenerService.updateListenerById(res.id, {
                        minprice: minprice
                    });
                }
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
