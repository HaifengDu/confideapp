"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const MongoSortFilterModelSchema = new Mongoose.Schema({
    uid: Number,
    generalprice: Number,
    auth: Boolean,
    praisepercent: Number,
    sex: Number,
    family: Number,
    birthday: Date,
    edu: Number,
    sealtimes: Number,
    receivestatus: Number,
    labelids: Mongoose.SchemaTypes.Array
});
const MongoSortFilterModel = Mongoose.model('sortfiltermodel', MongoSortFilterModelSchema);
exports.default = MongoSortFilterModel;
