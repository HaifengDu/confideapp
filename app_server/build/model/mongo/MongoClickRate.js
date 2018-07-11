"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const MongoClickRateModel = new Mongoose.Schema({
    pid: Number,
    lid: Number,
    ldate: String
});
const MongoClickRate = Mongoose.model('homeclickrate', MongoClickRateModel);
exports.default = MongoClickRate;
