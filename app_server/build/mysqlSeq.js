"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const Sequelize = require('sequelize');
const Sequelize = require("sequelize");
const sequelize = new Sequelize('aw_api', 'root', 'dkl20170531', {
    host: '47.93.50.205',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
exports.default = sequelize;
