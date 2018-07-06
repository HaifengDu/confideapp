"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PriceSettingBiz_1 = require("../biz/PriceSettingBiz");
const Bluebird = require("bluebird");
const _ = require("lodash");
const ErrorMsg_1 = require("../model/ErrorMsg");
const EPriceType_1 = require("../enum/EPriceType");
class ListenerPriceMediator {
    constructor() {
    }
    setPriceSetting(priceSettingService) {
        console.log("已设置价格");
        this.priceSettingService = priceSettingService;
    }
    setListener(ListenerService) {
        console.log("已设置倾听者服务");
        this.listenerService = ListenerService;
    }
    createDefaultPrice(userid, options) {
        return this.priceSettingService.createDefaultPrice(userid, options);
    }
    /**
     * 同步最小价
     * @param uid
     * @param price
     */
    syncMinPrice(uid, price, type) {
        return this.listenerService.findByUserid(uid).then((res) => {
            const minprice = Math.min(price, res.minprice || 0);
            const updateAttrs = {};
            if (minprice !== res.minprice) {
                updateAttrs.minprice = minprice;
            }
            let countkey = "wchcount";
            let lastchangeDate = "wchlastdate";
            if (type === EPriceType_1.default.ECall) {
                countkey = "cchcount";
                lastchangeDate = "cchlastdate";
            }
            if (!res[lastchangeDate]) {
                //第一次没有日期
                res[lastchangeDate] = new Date();
            }
            updateAttrs[countkey] = res[countkey] || 0;
            //如果在当前月 更新最后时间和累加次数
            if (this.compareDate(res[lastchangeDate])) {
                updateAttrs[countkey]++;
            }
            else {
                updateAttrs[countkey] = 0;
            }
            updateAttrs[lastchangeDate] = new Date();
            return this.listenerService.updateListenerById(res.id, updateAttrs);
        });
    }
    checkChangePriceMaxCount(uid, type) {
        return this.listenerService.findByUserid(uid).then(res => {
            let countkey = "wchcount";
            let lastchangeDate = "wchlastdate";
            if (type === EPriceType_1.default.ECall) {
                countkey = "cchcount";
                lastchangeDate = "cchlastdate";
            }
            if (res[countkey] > PriceSettingBiz_1.default.MaxChangeCount && this.compareDate(res[lastchangeDate])) {
                return Bluebird.reject(new ErrorMsg_1.default(false, `当月修改修改价格不能超过${PriceSettingBiz_1.default.MaxChangeCount}次`));
            }
            return Bluebird.resolve(res);
        });
    }
    /**
     * 最后修改时间是否在当前月
     * @param last
     */
    compareDate(last) {
        if (!last) {
            return true;
        }
        if (_.isNaN(last.getFullYear())) {
            return true;
        }
        const now = new Date();
        const lyear = last.getFullYear();
        const nyear = now.getFullYear();
        const lmonth = last.getMonth();
        const nmonth = now.getMonth();
        //当前年月一样 
        return lyear === nyear && lmonth === nmonth;
    }
    static createInstance() {
        ListenerPriceMediator.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = ListenerPriceMediator;
