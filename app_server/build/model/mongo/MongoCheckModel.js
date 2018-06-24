"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const MongoCheckModel = new Mongoose.Schema({
    senduid: Number,
    touid: Number,
    roomid: String,
    msg: String,
    date: Date,
    status: Number
});
const MongoCheckRecord = Mongoose.model('chatrecord', MongoCheckModel);
exports.default = MongoCheckRecord;
