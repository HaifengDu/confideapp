"use strict";
const ChatSocket_1 = require("../controller/ChatSocket");
const SocketManger_1 = require("../controller/SocketManger");
const NetCallSocket_1 = require("../controller/NetCallSocket");
const OrderSocket_1 = require("../controller/OrderSocket");
const socketManager = SocketManger_1.default.getInstance();
module.exports = class SocketHelper {
    constructor(socketio) {
        this.chatPath = "/chat";
        this.orderPath = "/order";
        this.socketio = socketio;
        this.initEvent();
        this.initOrderEvent();
    }
    initEvent() {
        this.socketio.of(this.chatPath).on("connection", socket => {
            let uid = socket.handshake.query.uid;
            if (uid) {
                ChatSocket_1.ChatSocket.getInstance(socket);
                NetCallSocket_1.NetCallSocket.getInstance(socket);
            }
            socket.on("disconnect", () => {
                socketManager.remove(socket);
            });
            socket.on("close", () => {
                socketManager.remove(socket);
            });
            socketManager.add(uid, socket);
        });
        this.socketio.on("connect", socket => {
            console.log("socket connect");
        });
        this.socketio.on('close', socket => {
            socketManager.clear();
        });
        this.socketio.on('error', () => {
            socketManager.clear();
        });
    }
    /**
     * 初始化order socket
     */
    initOrderEvent() {
        this.socketio.of(this.orderPath).on("connection", socket => {
            //
            let uid = socket.handshake.query.uid;
            if (uid) {
                OrderSocket_1.OrderSocket.getInstance(socket, parseInt(uid));
            }
        });
        this.socketio.on("connect", socket => {
            console.log("socket connect");
        });
        this.socketio.on('close', socket => {
            console.log("socket close");
        });
        this.socketio.on('error', () => {
            console.log("socket error");
        });
    }
    static createInstance(socketio) {
        SocketHelper.getInstance(socketio);
    }
    static getInstance(socketio) {
        return this._instance || (this._instance = new this(socketio));
    }
};
