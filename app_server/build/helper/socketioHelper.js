"use strict";
const ChatSocket_1 = require("../controller/ChatSocket");
const SocketManger_1 = require("../controller/SocketManger");
const NetCallSocket_1 = require("../controller/NetCallSocket");
const socketManager = SocketManger_1.default.getInstance();
module.exports = class SocketHelper {
    constructor(socketio) {
        this.chatPath = "/chat";
        this.socketio = socketio;
        this.initEvent();
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
    static createInstance(socketio) {
        SocketHelper.getInstance(socketio);
    }
    static getInstance(socketio) {
        return this._instance || (this._instance = new this(socketio));
    }
};
