"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const MongoVisitRecordModel = new Mongoose.Schema({
    pid: Number,
    lid: Number,
    ldate: String
});
exports.MongoVisitRecord = Mongoose.model('clickrate', MongoVisitRecordModel);
exports.default = exports.MongoVisitRecord;
