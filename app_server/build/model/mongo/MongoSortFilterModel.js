"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const MongoSortFilterModelSchema = new Mongoose.Schema({
    uid: Number,
    generalprice: Number,
    address: Number,
    auth: Boolean,
    praisepercent: Number,
    sex: Number,
    family: Number,
    birthday: Date,
    edu: Number,
    sealtimes: Number,
    receivestatus: Number,
    labelids: Array //标签
});
const MongoSortFilterModel = Mongoose.model('sortfiltermodel', MongoSortFilterModelSchema);
exports.default = MongoSortFilterModel;
