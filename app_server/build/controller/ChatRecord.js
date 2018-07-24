"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorMsg_1 = require("../model/ErrorMsg");
const MongoChatModel_1 = require("../model/mongo/MongoChatModel");
const EChatMsgStatus_1 = require("../enum/EChatMsgStatus");
class ChatRecordService {
    constructor() {
        this.DEFAULT_LENGTH = 20;
    }
    getRecord(roomid) {
        if (!roomid) {
            Promise.reject(new ErrorMsg_1.default(false, "roomid不能为空"));
        }
        return MongoChatModel_1.default.find({
            roomid: roomid,
        }).sort({
            date: -1
        }).limit(this.DEFAULT_LENGTH).then(res => {
            const list = res.filter(item => item.status === EChatMsgStatus_1.EChatMsgStatus.Send);
            //找出未读，更新为已读
            if (list.length) {
                MongoChatModel_1.default.update({
                    _id: {
                        '$in': list.map(item => item._id)
                    }
                }, {
                    status: EChatMsgStatus_1.EChatMsgStatus.Readed
                });
            }
            return res;
        });
    }
    static createInstance() {
        ChatRecordService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = ChatRecordService;
