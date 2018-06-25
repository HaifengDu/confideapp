"use strict";
// tslint:disable-next-line:no-unused-expression
const crypto = require("crypto");
const MongoCheckModel_1 = require("../model/mongo/MongoCheckModel");
module.exports = class SocketHelper {
    constructor(socketio) {
        this.chatPath = "/chat";
        this.joinEvent = "join";
        this.sendEvent = "send";
        this.socketio = socketio;
        this.initEvent();
        MongoCheckModel_1.default.create({ senduid: 1, touid: 2, roomid: "123123123123", msg: "测试", date: new Date(), status: 1 });
    }
    initEvent() {
        this.socketio.of(this.chatPath).on("connection", socket => {
            // console.log("socket get new connnection");   
            const roomid = socket.handshake.query.roomid;
            if (!roomid) {
                socket.disconnect();
                return;
            }
            socket.join(roomid);
            socket.on(this.joinEvent, name => {
                socket.to(roomid).broadcast.emit(this.joinEvent, `${name}加入房间`);
            });
            socket.on(this.sendEvent, msg => {
                socket.to(roomid).broadcast.emit(this.sendEvent, msg);
            });
        });
        this.socketio.on("connect", socket => {
            console.log("socket connect");
        });
    }
    createRoom(source, target) {
        const hashCode = crypto.createHash('sha1');
        const roomid = hashCode.update(`${source}_${target}`, 'utf8').digest('hex');
        return roomid;
    }
    static createInstance(socketio) {
        SocketHelper.getInstance(socketio);
    }
    static getInstance(socketio) {
        return this._instance || (this._instance = new this(socketio));
    }
};
