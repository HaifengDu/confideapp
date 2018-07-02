"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EPriceCircle_1 = require("../enum/EPriceCircle");
const _ = require("lodash");
const ErrorMsg_1 = require("../model/ErrorMsg");
class PriceSettingBiz {
    constructor() {
    }
    /**
     * 文字设置价格验证
     * @param pricesettings
     */
    checkWordSetting(pricesettings) {
        //验证
        if (!pricesettings || !_.isArray(pricesettings) || !pricesettings.length) {
            return new ErrorMsg_1.default(false, "价格设置不能为空");
        }
        if (!this.checkCircle(pricesettings)) {
            return new ErrorMsg_1.default(false, "定价时间非法");
        }
        const limitResult = this.checkLimit(pricesettings);
        if (!limitResult.success) {
            return limitResult;
        }
        return new ErrorMsg_1.default(true);
    }
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
        if (timecircle < PriceSettingBiz.CallMinTime) {
            return new ErrorMsg_1.default(false, `时长必须大于等于${PriceSettingBiz.CallMinTime}分钟`);
        }
        const result = this.simpleCheck(pricesettings[0], PriceSettingBiz.CallLimit);
        if (!result.success) {
            return result;
        }
        return new ErrorMsg_1.default(true);
    }
    checkLimit(pricesettings) {
        let result = new ErrorMsg_1.default(true);
        for (let i = 0, l = pricesettings.length; i < l; i++) {
            const current = pricesettings[i];
            const limit = PriceSettingBiz.WordLimit[current.timecircle];
            if (!limit) {
                result = new ErrorMsg_1.default(false, "价格限制非法");
                break;
            }
            result = this.simpleCheck(current, limit);
            if (!result.success) {
                break;
            }
        }
        return result;
    }
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
    checkCircle(pricesettings) {
        let result = true;
        const circleKeys = _.values(EPriceCircle_1.EPriceCircle);
        const length = pricesettings.filter(item => circleKeys.indexOf(item.timecircle) === -1).length;
        return length === 0;
    }
    static createInstance() {
        PriceSettingBiz.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
PriceSettingBiz.WordLimit = {
    [EPriceCircle_1.EPriceCircle.Fifteen]: {
        min: 5,
        max: 100
    },
    [EPriceCircle_1.EPriceCircle.Thirty]: {
        min: 5,
        max: 200
    },
    [EPriceCircle_1.EPriceCircle.FortyFive]: {
        min: 5,
        max: 300
    },
    [EPriceCircle_1.EPriceCircle.Sixty]: {
        min: 5,
        max: 400
    }
};
PriceSettingBiz.CallLimit = {
    min: 0.6,
    max: 20
};
PriceSettingBiz.CallMinTime = 15;
exports.default = PriceSettingBiz;
