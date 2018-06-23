"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysqlSeq_1 = require("../mysqlSeq");
const User_1 = require("./User");
const Listener = mysqlSeq_1.default.define('mainlbale', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, comment: "唯一id" },
    job: { type: Sequelize.TINYINT, comment: "职业" },
    family: { type: Sequelize.TINYINT, comment: "家庭" },
    edu: { type: Sequelize.TINYINT, comment: "学历" },
    resume: { type: Sequelize.TEXT, comment: "简历" },
    recivestatus: { type: Sequelize.TINYINT, comment: "接单状态" },
    isopentime: { type: Sequelize.STRING, comment: "接单时间" },
    status: { type: Sequelize.TINYINT, defaultValue: 0, comment: "状态" }
}, {
    freezeTableName: true
});
Listener.belongsTo(User_1.default);
Listener.sync();
exports.default = Listener;
