"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = require("./Order");
const logHelper_1 = require("../helper/logHelper");
const ErrorMsg_1 = require("../model/ErrorMsg");
class OrderSocket {
    constructor(socket, userid) {
        this.socket = socket;
        this.userid = userid;
        this.orderService = Order_1.default.getInstance();
        this.logHelper = logHelper_1.LogHelper.getInstance();
        this.initEvent();
    }
    initEvent() {
        this.socket.on(OrderSocket.AddCount, this.addCount.bind(this));
        this.socket.on(OrderSocket.CommitCount, this.commitCount.bind(this));
        this.socket.on('disconnect', this.mCommitCount.bind(this));
    }
    addCount(data) {
        if (!data || !data.oid) {
            return;
        }
        if (!(data.oid in this.countContainer)) {
            this.countContainer[data.oid] = 0;
        }
        this.countContainer[data.oid]++;
    }
    commitCount(data) {
        if (!data || !data.oid) {
            return Promise.reject(new ErrorMsg_1.default(false, "订单id不能为空"));
        }
        // 更新时长
        const count = this.countContainer[data.oid];
        return this.orderService.updateServicetime(this.userid, data.oid, count).then(res => {
            this.logHelper.append({
                body: res,
                message: "更新订单时长成功"
            });
            delete this.countContainer[data.oid];
        });
    }
    mCommitCount() {
        const promiseList = [];
        for (let key in this.countContainer) {
            promiseList.push(this.commitCount({ oid: parseInt(key) }));
        }
        return Promise.all(promiseList);
    }
    static getInstance(socket, userid) {
        return new OrderSocket(socket, userid);
    }
}
OrderSocket.AddCount = "add_count";
OrderSocket.CommitCount = "add_count";
exports.OrderSocket = OrderSocket;
