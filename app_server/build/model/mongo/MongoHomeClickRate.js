"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const MongoHomeClickRateModel = new Mongoose.Schema({
    pid: Number,
    lid: Number,
    ldate: String
});
const MongoHomeClickRate = Mongoose.model('homeclickrate', MongoHomeClickRateModel);
exports.default = MongoHomeClickRate;
