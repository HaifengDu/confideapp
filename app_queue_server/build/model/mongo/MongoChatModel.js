"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const MongoChatModel = new Mongoose.Schema({
    senduid: Number,
    touid: Number,
    roomid: String,
    msg: String,
    date: Date,
    status: Number
});
const MongoChatRecord = Mongoose.model('chatrecord', MongoChatModel);
exports.default = MongoChatRecord;
