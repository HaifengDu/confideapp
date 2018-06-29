"use strict";
var _a;
// tslint:disable-next-line:no-unused-expression
const crypto = require("crypto");
const MongoChatModel_1 = require("../model/mongo/MongoChatModel");
const EChatMsgStatus_1 = require("../enum/EChatMsgStatus");
const util_1 = require("./util");
module.exports = (_a = class SocketHelper {
        constructor(socketio) {
            this.chatPath = "/chat";
            this.joinEvent = "join";
            this.sendEvent = "send";
            this.roomDic = {};
            this.socketio = socketio;
            this.initEvent();
        }
        initEvent() {
            this.socketio.of(this.chatPath).on("connection", socket => {
                // console.log("socket get new connnection");   
                const roomid = socket.handshake.query.roomid;
                const senduid = socket.handshake.query.senduid;
                const touid = socket.handshake.query.touid;
                if (!roomid || !senduid || !touid) {
                    socket.disconnect(true);
                    return;
                }
                socket.join(roomid);
                if (!this.roomDic[roomid]) {
                    this.roomDic[roomid] = [];
                }
                socket.on(this.joinEvent, name => {
                    socket.to(roomid).broadcast.emit(this.joinEvent, `${name}加入房间`);
                });
                socket.on(this.sendEvent, msg => {
                    this.roomDic[roomid].push({
                        roomid,
                        senduid,
                        touid,
                        msg,
                        date: new Date(),
                        status: EChatMsgStatus_1.EChatMsgStatus.Send
                    });
                    //当消息长度大于最大限制时，插入库中并删除
                    if (this.roomDic[roomid].length >= SocketHelper.MAX_MSG_LENGTH) {
                        setTimeout(() => {
                            util_1.retryInsertMongo(SocketHelper.RETRY_COUNT)(MongoChatModel_1.default, this.roomDic[roomid], (err, docs) => {
                                this.roomDic[roomid].splice(0, SocketHelper.MAX_MSG_LENGTH);
                            });
                        });
                    }
                    socket.to(roomid).broadcast.emit(this.sendEvent, msg);
                });
                socket.on('disconnect', (reason) => {
                    if (this.roomDic[roomid].length) {
                        util_1.retryInsertMongo(SocketHelper.RETRY_COUNT)(MongoChatModel_1.default, this.roomDic[roomid], (err, docs) => {
                            delete this.roomDic[roomid];
                        });
                    }
                });
                socket.on("error", () => {
                    delete this.roomDic[roomid];
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
    },
    _a.RETRY_COUNT = 5,
    _a.MAX_MSG_LENGTH = 100,
    _a);
