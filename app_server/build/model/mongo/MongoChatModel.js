"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const MongoChatModel = new Mongoose.Schema({
    tokenid: String,
    senduid: Number,
    touid: Number,
    roomid: String,
    msg: String,
    serverId: String,
    type: Number,
    isload: Boolean,
    date: Date,
    status: Number
});
const MongoChatRecord = Mongoose.model('chatrecord', MongoChatModel);
exports.default = MongoChatRecord;
