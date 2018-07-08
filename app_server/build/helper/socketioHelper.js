"use strict";
var _a;
// tslint:disable-next-line:no-unused-expression
const MongoChatModel_1 = require("../model/mongo/MongoChatModel");
const EChatMsgStatus_1 = require("../enum/EChatMsgStatus");
const util_1 = require("./util");
const ERole_1 = require("../enum/ERole");
const EChatMsgType_1 = require("../enum/EChatMsgType");
const _ = require("lodash");
const syncHelper_1 = require("./syncHelper");
module.exports = (_a = class SocketHelper {
        constructor(socketio) {
            this.chatPath = "/chat";
            this.joinEvent = "join";
            this.sendEvent = "send";
            this.notifyEvent = "notify";
            this.createOwnRoom = "createOwn";
            this.syncHelper = syncHelper_1.default.getInstance();
            this.socketio = socketio;
            this.initEvent();
        }
        initEvent() {
            this.socketio.of(this.chatPath).on("connection", socket => {
                const roomDic = {};
                const role = socket.handshake.query.role === "0" ? ERole_1.ERole.Pourouter : ERole_1.ERole.Listener;
                // socket.on()
                socket.on(this.joinEvent, (res) => {
                    const pid = res.pid; //倾诉者
                    const lid = res.lid; //倾听者
                    const roomid = this.createRoom(pid, lid);
                    socket.join(roomid);
                    socket.to(roomid).broadcast.emit(this.joinEvent, { msg: `${name}加入房间`, roomid });
                });
                socket.on(this.sendEvent, res => {
                    let tempsenduid = res.pid;
                    let temptouid = res.lid;
                    if (role === ERole_1.ERole.Listener) {
                        tempsenduid = res.lid;
                        temptouid = res.pid;
                    }
                    const roomid = this.createRoom(res.pid, res.lid);
                    const msgObj = {
                        roomid,
                        senduid: tempsenduid,
                        touid: temptouid,
                        date: new Date(),
                        status: EChatMsgStatus_1.EChatMsgStatus.Send,
                        type: EChatMsgType_1.default.Text,
                        msg: res.msg
                    };
                    if (res.type === EChatMsgType_1.default.Audio) {
                        msgObj.isload = false;
                        msgObj.mediaid = res.mediaid;
                        msgObj.type = EChatMsgType_1.default.Audio;
                    }
                    roomDic[roomid].push(msgObj);
                    //当消息长度大于最大限制时，插入库中并删除
                    if (roomDic[roomid].length >= SocketHelper.MAX_MSG_LENGTH) {
                        setTimeout(() => {
                            const shouldInsertedRecord = roomDic[roomid].splice(0, SocketHelper.MAX_MSG_LENGTH);
                            util_1.retryInsertMongo(SocketHelper.RETRY_COUNT)(MongoChatModel_1.default, shouldInsertedRecord, (err, docs) => {
                                const ids = docs.filter(item => item.type === EChatMsgType_1.default.Audio).map(item => item._id);
                                if (ids.length) {
                                    this.syncHelper.syncAudio(ids);
                                }
                            });
                        });
                    }
                    socket.to(roomid).broadcast.emit(this.sendEvent, msgObj);
                    //去指定的用户通知
                    socket.to(temptouid).broadcast.emit(this.notifyEvent, msgObj);
                });
                socket.on('disconnect', (reason) => {
                    const values = _.values(roomDic);
                    const records = _.flatten(values);
                    if (records.length) {
                        util_1.retryInsertMongo(SocketHelper.RETRY_COUNT)(MongoChatModel_1.default, records, (err, docs) => {
                            for (let key in roomDic) {
                                delete roomDic[key];
                            }
                        });
                    }
                });
                socket.on("leave", (res) => {
                    const roomid = res.roomid;
                    if (roomid) {
                        socket.leave(roomid);
                        if (roomDic[roomid] && roomDic[roomid].length) {
                            util_1.retryInsertMongo(SocketHelper.RETRY_COUNT)(MongoChatModel_1.default, roomDic[roomid], (err, docs) => {
                                delete roomDic[roomid];
                            });
                        }
                    }
                });
                socket.on("error", () => {
                    for (let key in roomDic) {
                        delete roomDic[key];
                    }
                });
            });
            this.socketio.on("connect", socket => {
                console.log("socket connect");
            });
        }
        createRoom(source, target) {
            return source + "_" + target;
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
