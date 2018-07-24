"use strict";
const ChatSocket_1 = require("../controller/ChatSocket");
module.exports = class SocketHelper {
    constructor(socketio) {
        this.chatPath = "/chat";
        this.socketio = socketio;
        this.initEvent();
    }
    initEvent() {
        this.socketio.of(this.chatPath).on("connection", socket => {
            ChatSocket_1.ChatSocket.getInstance(socket);
        });
        this.socketio.on("connect", socket => {
            console.log("socket connect");
        });
    }
    static createInstance(socketio) {
        SocketHelper.getInstance(socketio);
    }
    static getInstance(socketio) {
        return this._instance || (this._instance = new this(socketio));
    }
};
