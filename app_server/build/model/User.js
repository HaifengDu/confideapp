"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysqlSeq_1 = require("../mysqlSeq");
const User = mysqlSeq_1.default.define('user', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    weixinid: Sequelize.STRING(50),
    sex: Sequelize.TINYINT,
    birthday: Sequelize.DATE,
    address: Sequelize.STRING,
    role: Sequelize.TINYINT,
    status: { type: Sequelize.TINYINT, defaultValue: 0 },
    follow: Sequelize.STRING(500)
}, {
    freezeTableName: true
});
exports.default = User;
