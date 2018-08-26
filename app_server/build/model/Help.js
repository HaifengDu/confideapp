"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysqlSeq_1 = require("../mysqlSeq");
const User_1 = require("./User");
const Help = mysqlSeq_1.default.define("help", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, comment: "唯一id" },
    uid: { type: Sequelize.INTEGER, comment: "user外键", allowNull: false },
    labelid: { type: Sequelize.INTEGER, comment: "求助标签外键", allowNull: false },
    money: { type: Sequelize.FLOAT, comment: "悬赏金额", defaultValue: 0 },
    status: { type: Sequelize.TINYINT, comment: "状态", defaultValue: 0 },
    content: { type: Sequelize.TEXT, comment: "内容" },
    recieveid: { type: Sequelize.INTEGER, comment: "回复id", }
}, {
    freezeTableName: true
});
Help.belongsTo(User_1.default, {
    foreignKey: "uid"
});
Help.sync({ alter: true });
exports.default = Help;
