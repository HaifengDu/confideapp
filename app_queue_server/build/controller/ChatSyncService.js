"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoChatModel_1 = require("../model/mongo/MongoChatModel");
const Bluebird = require("bluebird");
const ErrorMsg_1 = require("../model/ErrorMsg");
const bson_1 = require("bson");
const EChatMsgType_1 = require("../enum/EChatMsgType");
const winxinHelper_1 = require("../helper/winxinHelper");
class ChatSyncService {
    constructor() {
        this.winxinHelper = winxinHelper_1.default.getInstance();
    }
    syncAudio(ids) {
        if (!ids || !ids.length) {
            return Bluebird.reject(new ErrorMsg_1.default(false, "参数不能为空"));
        }
        const objIds = ids.map(item => new bson_1.ObjectID(item));
        MongoChatModel_1.default.find({
            "_id": {
                "$in": objIds
            }
        }).then(res => {
            if (res.length) {
                const list = res.filter(item => item.type === EChatMsgType_1.EChatMsgType.Audio && !item.isload && item.mediaid);
                this.winxinHelper.getAccessToken().then(res => {
                    Promise.all(list.map(item => {
                        return this.winxinHelper.downLoadFile(res.access_token, item.roomid, item.mediaid).then(data => {
                            return MongoChatModel_1.default.update({
                                isload: true
                            }, {
                                _id: item._id
                            });
                        });
                    }));
                });
            }
        });
    }
    static createInstance() {
        ChatSyncService.getInstance();
    }
    static getInstance() {
        return this._instance || (this._instance = new this());
    }
}
exports.default = ChatSyncService;
