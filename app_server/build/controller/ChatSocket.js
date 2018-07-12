"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ERole_1 = require("../enum/ERole");
const EChatMsgStatus_1 = require("../enum/EChatMsgStatus");
const EChatMsgType_1 = require("../enum/EChatMsgType");
const util_1 = require("../helper/util");
const MongoChatModel_1 = require("../model/mongo/MongoChatModel");
const syncHelper_1 = require("../helper/syncHelper");
const _ = require("lodash");
class ChatSocket {
    constructor(socket, role) {
        this.socket = socket;
        this.role = role;
        this.roomDic = {};
        this.syncHelper = syncHelper_1.default.getInstance();
        this.initEvent();
    }
    static createRoom(source, target) {
        return source + "_" + target;
    }
    initEvent() {
        this.socket.on(ChatSocket.joinEvent, this.joinRoom.bind(this));
        this.socket.on(ChatSocket.sendEvent, this.sendMsg.bind(this));
        this.socket.on('disconnect', this.disconnectInsetAll.bind(this));
        this.socket.on("leave", this.leaveInsertRoomRecords.bind(this));
        this.socket.on("error", () => {
            for (let key in this.roomDic) {
                delete this.roomDic[key];
            }
        });
    }
    /**
     * 加入房间事件
     * @param data
     */
    joinRoom(data) {
        const pid = data.pid; //倾诉者
        const lid = data.lid; //倾听者
        const roomid = ChatSocket.createRoom(pid, lid);
        this.socket.join(roomid);
        this.socket.to(roomid).emit(ChatSocket.joinEvent, { msg: `${data.name}加入房间`, roomid });
    }
    /**
     * 发送消息事件
     * @param res
     */
    sendMsg(res) {
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
        if (!this.roomDic[roomid]) {
            this.roomDic[roomid] = [];
        }
        this.roomDic[roomid].push(msgObj);
        //当消息长度大于最大限制时，插入库中并删除
        if (this.roomDic[roomid].length >= ChatSocket.MAX_MSG_LENGTH) {
            setTimeout(() => {
                const shouldInsertedRecord = this.roomDic[roomid].splice(0, ChatSocket.MAX_MSG_LENGTH);
                util_1.retryInsertMongo(ChatSocket.RETRY_COUNT)(MongoChatModel_1.default, shouldInsertedRecord, (err, docs) => {
                    this.syncAudio(docs);
                });
            });
        }
        this.socket.to(roomid).broadcast.emit(ChatSocket.sendEvent, msgObj);
        //去指定的用户通知
        this.socket.to(temptouid.toString()).broadcast.emit(ChatSocket.notifyEvent, msgObj);
    }
    /**
     * 端口链接事件
     */
    disconnectInsetAll() {
        const values = _.values(this.roomDic);
        const records = _.flatten(values);
        if (records.length) {
            util_1.retryInsertMongo(ChatSocket.RETRY_COUNT)(MongoChatModel_1.default, records, (err, docs) => {
                for (let key in this.roomDic) {
                    delete this.roomDic[key];
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
            if (this.roomDic[roomid] && this.roomDic[roomid].length) {
                util_1.retryInsertMongo(ChatSocket.RETRY_COUNT)(MongoChatModel_1.default, this.roomDic[roomid], (err, docs) => {
                    delete this.roomDic[roomid];
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
ChatSocket.MAX_MSG_LENGTH = 100;
ChatSocket.RETRY_COUNT = 5;
exports.ChatSocket = ChatSocket;
exports.default = ChatSocket;
