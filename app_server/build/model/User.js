"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysqlSeq_1 = require("../mysqlSeq");
const User = mysqlSeq_1.default.define('user', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, comment: "唯一id" },
    weixinid: { type: Sequelize.STRING(100), allowNull: false, comment: "微信id" },
    sex: { type: Sequelize.TINYINT, comment: "性别：1、男；2、女" },
    birthday: Sequelize.DATE,
    address: Sequelize.STRING,
    nickname: { type: Sequelize.STRING, comment: "别名" },
    role: { type: Sequelize.TINYINT, comment: "角色：1、倾诉者，2、倾听者" },
    headimgurl: { type: Sequelize.STRING, comment: "头像" },
    status: { type: Sequelize.TINYINT, defaultValue: 0 },
    follow: { type: Sequelize.STRING(500), comment: "关注ids" }
}, {
    freezeTableName: true
});
User.sync();
exports.default = User;
