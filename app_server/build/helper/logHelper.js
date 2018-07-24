"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require("log4js");
class LogHelper {
    static configure() {
        log4js.configure({
            appenders: {
                common: { type: 'dateFile', filename: './log/common/server_confide.log' },
                order: { type: 'dateFile', filename: "./log/order/order.log" }
            },
            categories: {
                default: { appenders: ['common'], level: 'debug' },
                order: { appenders: ["order"], level: "debug" }
            }
        });
    }
    constructor() {
        this.configure();
    }
    configure() {
        this.commonLogger = log4js.getLogger("common");
        this.orderLogger = log4js.getLogger("order");
    }
    addDate(obj) {
        if (obj) {
            obj.date = new Date();
        }
    }
    appendOrder(obj) {
        this.addDate(obj);
        this.orderLogger.log(JSON.stringify(obj));
    }
    errorOrder(obj) {
        this.addDate(obj);
        this.orderLogger.error(JSON.stringify(obj));
    }
    append(obj) {
        this.commonLogger.log(JSON.stringify(obj));
    }
    error(obj) {
        this.commonLogger.error(JSON.stringify(obj));
    }
    static createInstance() {
        LogHelper.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.LogHelper = LogHelper;
exports.default = LogHelper;
