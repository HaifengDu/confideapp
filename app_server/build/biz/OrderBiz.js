"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorMsg_1 = require("../model/ErrorMsg");
const _ = require("lodash");
const EPriceType_1 = require("../enum/EPriceType");
const CalucateService_1 = require("../helper/CalucateService");
const EOrderSource_1 = require("../enum/order/EOrderSource");
class OrderBizService {
    constructor() {
    }
    static createInstance() {
        OrderBizService.getInstance();
    }
    checkOrder(order) {
        if (!order) {
            return new ErrorMsg_1.default(false, "订单不能为空");
        }
        if (!order.ip) {
            return new ErrorMsg_1.default(false, "订单产生ip不能为空");
        }
        if (!order.useragent) {
            return new ErrorMsg_1.default(false, "用户代理头不能为空");
        }
        if (!order.uid || !_.isNumber(order.lid)) {
            return new ErrorMsg_1.default(false, "用户不能为空");
        }
        if (!order.lid || !_.isNumber(order.lid)) {
            return new ErrorMsg_1.default(false, "倾听者id不能为空");
        }
        if (!order.payservicetime || !_.isNumber(order.payservicetime)) {
            return new ErrorMsg_1.default(false, "购买时长不能为空");
        }
        if (order.payservicetime <= 0) {
            return new ErrorMsg_1.default(false, "购买时长必须大于0");
        }
        if (!order.totalprice || !_.isNumber(order.totalprice)) {
            return new ErrorMsg_1.default(false, "支付总金额不能为空");
        }
        if (order.totalprice <= 0) {
            return new ErrorMsg_1.default(false, "支付总金额必须大于0");
        }
        if (!order.payprice || !_.isNumber(order.payprice)) {
            return new ErrorMsg_1.default(false, "支付价格不能为空");
        }
        if (!order.uprice || !_.isNumber(order.uprice)) {
            return new ErrorMsg_1.default(false, "单价不能为空");
        }
        //余额和总计不同时，支付金额必须大于0
        if (order.balance !== order.totalprice) {
            if (order.payprice <= 0) {
                return new ErrorMsg_1.default(false, "支付价格不能为空");
            }
        }
        if ('balance' in order) {
            if (!_.isNumber(order.balance)) {
                return new ErrorMsg_1.default(false, "余额非法");
            }
        }
        const shouldpay = CalucateService_1.default.numSub(order.totalprice, order.balance || 0);
        if (shouldpay !== order.payprice) {
            return new ErrorMsg_1.default(false, "支付金额计算不正确");
        }
        const serviceTypes = _.values(EPriceType_1.EPriceType);
        if (!(order.servicetype in serviceTypes)) {
            return new ErrorMsg_1.default(false, "服务类型非法");
        }
        const orderSources = _.values(EOrderSource_1.EOrderSource);
        if (!(order.source in orderSources)) {
            return new ErrorMsg_1.default(false, "订单来源非法");
        }
        return new ErrorMsg_1.default(true);
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = OrderBizService;
