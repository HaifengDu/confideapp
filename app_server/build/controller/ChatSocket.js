"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ERole_1 = require("../enum/ERole");
const EChatMsgStatus_1 = require("../enum/EChatMsgStatus");
const EChatMsgType_1 = require("../enum/EChatMsgType");
const util_1 = require("../helper/util");
const MongoChatModel_1 = require("../model/mongo/MongoChatModel");
const syncHelper_1 = require("../helper/syncHelper");
const _ = require("lodash");
const uuid = require("uuid");
const roomDic = {};
class ChatSocket {
    constructor(socket, role) {
        this.socket = socket;
        this.role = role;
        this.syncHelper = syncHelper_1.default.getInstance();
        this.initEvent();
    }
    static createRoom(source, target) {
        return source + "_" + target;
    }
    initEvent() {
        this.socket.on(ChatSocket.joinEvent, this.joinRoom.bind(this));
        this.socket.on(ChatSocket.sendEvent, this.sendMsg.bind(this));
        this.socket.on(ChatSocket.readEvent, this.read.bind(this));
        this.socket.on('disconnect', this.disconnectInsetAll.bind(this));
        this.socket.on("leave", this.leaveInsertRoomRecords.bind(this));
        this.socket.on("error", () => {
            for (let key in roomDic) {
                delete roomDic[key];
            }
        });
    }
    /**
     * 加入房间事件
     * @param data
     */
    joinRoom(data, ackFn) {
        const pid = data.pid; //倾诉者
        const lid = data.lid; //倾听者
        const roomid = ChatSocket.createRoom(pid, lid);
        this.socket.join(roomid);
        this.socket.to(roomid).emit(ChatSocket.joinEvent, { msg: `${data.name}加入房间`, roomid });
        ackFn(roomid);
    }
    /**
     * 发送消息事件
     * @param res
     */
    sendMsg(res, ackFn) {
        let tempsenduid = res.pid;
        let temptouid = res.lid;
        if (!tempsenduid || !temptouid) {
            return;
        }
        if (this.role === ERole_1.ERole.Listener) {
            tempsenduid = res.lid;
            temptouid = res.pid;
        }
        const roomid = ChatSocket.createRoom(res.pid, res.lid);
        const msgObj = {
            tokenid: uuid(),
            roomid,
            senduid: tempsenduid,
            touid: temptouid,
            date: new Date(),
            status: EChatMsgStatus_1.default.Send,
            type: EChatMsgType_1.default.Text,
            msg: res.msg
        };
        if (res.type === EChatMsgType_1.default.Audio) {
            msgObj.isload = false;
            msgObj.mediaid = res.mediaid;
            msgObj.type = EChatMsgType_1.default.Audio;
        }
        if (!roomDic[roomid]) {
            roomDic[roomid] = [];
        }
        roomDic[roomid].push(msgObj);
        //当消息长度大于最大限制时，插入库中并删除
        if (roomDic[roomid].length >= ChatSocket.MAX_MSG_LENGTH) {
            setTimeout(() => {
                const shouldInsertedRecord = roomDic[roomid].splice(0, ChatSocket.MAX_MSG_LENGTH);
                util_1.retryInsertMongo(ChatSocket.RETRY_COUNT)(MongoChatModel_1.default, shouldInsertedRecord, (err, docs) => {
                    this.syncAudio(docs);
                });
            });
        }
        this.socket.to(roomid).broadcast.emit(ChatSocket.sendEvent, msgObj);
        //去指定的用户通知
        this.socket.to(temptouid.toString()).broadcast.emit(ChatSocket.notifyEvent, msgObj);
        ackFn(msgObj);
    }
    read(data) {
        const roomid = data.roomid;
        if (roomDic[roomid] && roomDic[roomid].length) {
            const chatList = roomDic[roomid];
            const current = chatList.find(item => item.tokenid === data.tokenid);
            if (current) {
                this.socket.to(roomid).broadcast.emit(ChatSocket.readEvent, current.tokenid);
                MongoChatModel_1.default.update({
                    tokenid: current.tokenid
                }, {
                    status: EChatMsgStatus_1.default.Readed
                });
            }
        }
    }
    /**
     * 端口链接事件
     */
    disconnectInsetAll() {
        const rooms = _.values(this.socket.rooms);
        let records = [];
        rooms.forEach(item => {
            records = records.concat(roomDic[item] || []);
        });
        // const values = _.values(roomDic);
        // const records = _.flatten(values);
        if (records.length) {
            util_1.retryInsertMongo(ChatSocket.RETRY_COUNT)(MongoChatModel_1.default, records, (err, docs) => {
                for (let key in roomDic) {
                    delete roomDic[key];
                }
                this.syncAudio(docs);
            });
        }
    }
    /**
     * 离开房间事件
     * @param data
     */
    leaveInsertRoomRecords(data) {
        const roomid = data.roomid;
        if (roomid) {
            this.socket.leave(roomid);
            if (roomDic[roomid] && roomDic[roomid].length) {
                util_1.retryInsertMongo(ChatSocket.RETRY_COUNT)(MongoChatModel_1.default, roomDic[roomid], (err, docs) => {
                    delete roomDic[roomid];
                    this.syncAudio(docs);
                });
            }
        }
    }
    /**
     * 同步音频
     * @param docs
     */
    syncAudio(docs) {
        const ids = docs.filter(item => item.type === EChatMsgType_1.default.Audio).map(item => item._id);
        if (ids.length) {
            this.syncHelper.syncAudio(ids);
        }
    }
    static getInstance(socket, role) {
        return new ChatSocket(socket, role);
    }
}
ChatSocket.joinEvent = "join";
ChatSocket.sendEvent = "send";
ChatSocket.notifyEvent = "notify";
ChatSocket.readEvent = "read";
ChatSocket.MAX_MSG_LENGTH = 100;
ChatSocket.RETRY_COUNT = 5;
exports.ChatSocket = ChatSocket;
exports.default = ChatSocket;
