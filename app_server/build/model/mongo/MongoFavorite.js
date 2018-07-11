"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const MongoFavoriteModel = new Mongoose.Schema({
    pid: Number,
    lid: Number,
    ldate: String
});
exports.MongoFavorite = Mongoose.model('favorite', MongoFavoriteModel);
exports.default = exports.MongoFavorite;
