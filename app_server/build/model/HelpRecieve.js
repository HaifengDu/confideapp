"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysqlSeq_1 = require("../mysqlSeq");
const User_1 = require("./User");
const HelpRecieve = mysqlSeq_1.default.define("helprecieve", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, comment: "唯一id" },
    uid: { type: Sequelize.INTEGER, comment: "user外键", allowNull: false },
    helpid: { type: Sequelize.INTEGER, comment: "求助外键", allowNull: false },
    likecount: { type: Sequelize.INTEGER, comment: "悬赏金额", defaultValue: 0 },
    status: { type: Sequelize.TINYINT, comment: "状态", defaultValue: 0 },
    content: { type: Sequelize.TEXT, comment: "内容" },
    recieveid: { type: Sequelize.INTEGER, comment: "回复id", defaultValue: -1 }
}, {
    freezeTableName: true
});
HelpRecieve.belongsTo(User_1.default, {
    foreignKey: "uid"
});
HelpRecieve.sync({ force: true });
exports.default = HelpRecieve;
