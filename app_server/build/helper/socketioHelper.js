"use strict";
// tslint:disable-next-line:no-unused-expression
const ERole_1 = require("../enum/ERole");
const ChatSocket_1 = require("../controller/ChatSocket");
module.exports = class SocketHelper {
    constructor(socketio) {
        this.chatPath = "/chat";
        this.socketio = socketio;
        this.initEvent();
    }
    initEvent() {
        this.socketio.of(this.chatPath).on("connection", socket => {
            const role = socket.handshake.query.role === "0" ? ERole_1.ERole.Pourouter : ERole_1.ERole.Listener;
            ChatSocket_1.ChatSocket.getInstance(socket, role);
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
