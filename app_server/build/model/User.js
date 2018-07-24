"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysqlSeq_1 = require("../mysqlSeq");
const User = mysqlSeq_1.default.define('user', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, comment: "唯一id" },
    weixinid: { type: Sequelize.STRING(100), allowNull: false, comment: "微信id" },
    sex: { type: Sequelize.TINYINT, comment: "性别：1、男；2、女", allowNull: false },
    birthday: Sequelize.DATE,
    phone: { type: Sequelize.STRING, comment: "电话号码" },
    phonebindstatus: { type: Sequelize.TINYINT, comment: "电话绑定状态" },
    address: Sequelize.STRING,
    nickname: { type: Sequelize.STRING, comment: "别名" },
    role: { type: Sequelize.TINYINT, comment: "角色：1、倾诉者，2、倾听者" },
    headimgurl: { type: Sequelize.STRING, comment: "头像" },
    status: { type: Sequelize.TINYINT, defaultValue: 0 },
    follow: { type: Sequelize.STRING(500), comment: "关注ids" },
    resume: { type: Sequelize.TEXT, comment: "简历" },
    money: { type: Sequelize.FLOAT, defaultValue: 0, comment: "用户余额" }
}, {
    freezeTableName: true
});
User.sync({ alter: true });
exports.default = User;
