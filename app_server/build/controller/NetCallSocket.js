"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketManger_1 = require("./SocketManger");
const socketMananger = SocketManger_1.default.getInstance();
const eventkey_prefix = "netcall_";
class NetCallEventConstant {
}
NetCallEventConstant.calling = `${eventkey_prefix}calling`;
NetCallEventConstant.reject = `${eventkey_prefix}reject`;
NetCallEventConstant.close = `${eventkey_prefix}close`;
NetCallEventConstant.accept = `${eventkey_prefix}accept`;
NetCallEventConstant.hangup = `${eventkey_prefix}hangup`;
class NetCallSocket {
    constructor(socket) {
        this.socket = socket;
        this.initEvent();
    }
    initEvent() {
        this.socket.on(NetCallEventConstant.calling, this.calling.bind(this));
        this.socket.on(NetCallEventConstant.accept, this.accept.bind(this));
        this.socket.on(NetCallEventConstant.reject, this.reject.bind(this));
        this.socket.on(NetCallEventConstant.hangup, this.hangup.bind(this));
    }
    calling(obj, ackFn) {
        const toSocket = socketMananger.get(obj.touid);
        if (toSocket) {
            toSocket.emit(NetCallEventConstant.calling, {
                fromid: obj.uid, fromname: obj.name
            });
            ackFn();
        }
    }
    /**
     * 接受
     * @param obj
     * @param ackFn
     */
    accept(obj, ackFn) {
        const toSocket = socketMananger.get(obj.touid);
        if (toSocket) {
            toSocket.emit(NetCallEventConstant.accept, {
                fromid: obj.uid, fromname: ""
            });
            ackFn();
        }
    }
    /**
     * 拒绝
     * @param obj
     * @param ackFn
     */
    reject(obj, ackFn) {
        const toSocket = socketMananger.get(obj.touid);
        if (toSocket) {
            toSocket.emit(NetCallEventConstant.reject, {
                fromid: obj.uid, fromname: ""
            });
            ackFn();
        }
    }
    /**
     * 挂断
     * @param obj
     * @param ackFn
     */
    hangup(obj, ackFn) {
        const toSocket = socketMananger.get(obj.touid);
        if (toSocket) {
            toSocket.emit(NetCallEventConstant.hangup, {
                fromid: obj.uid, fromname: ""
            });
            ackFn();
        }
    }
    static getInstance(socket) {
        return new NetCallSocket(socket);
    }
}
exports.NetCallSocket = NetCallSocket;
