"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const options = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: 30,
    reconnectInterval: 3000,
    auto_reconnect: true,
    poolSize: 10
};
Mongoose.connect('mongodb://dhf:dkl20170531@47.93.50.205:27017/confide', options);
const db = Mongoose.connection;
db.on('error', function (err) {
    console.error('error');
    console.log(err);
    process.exit(1);
});
db.once('open', function (callback) {
    // yay!
    console.log('open');
});
exports.default = db;
