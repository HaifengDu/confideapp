"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysqlSeq_1 = require("../mysqlSeq");
const Evaluate = mysqlSeq_1.default.define("evaluate", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, comment: "唯一id" },
    uid: { type: Sequelize.INTEGER, comment: "user外键", allowNull: false },
    lid: { type: Sequelize.INTEGER, comment: "listener外键", allowNull: false },
    default: { type: Sequelize.TINYINT(4), comment: "是否默认", defaultValue: 0 },
    order: { type: Sequelize.INTEGER, comment: "订单外键", allowNull: false },
    timerate: { type: Sequelize.INTEGER, comment: "好评率" },
    serviceattitude: { type: Sequelize.INTEGER, comment: "服务态度" },
    servicepower: { type: Sequelize.INTEGER, comment: "服务能力" },
    satisfaction: { type: Sequelize.TINYINT(4), comment: "满意程度" },
    labels: { type: Sequelize.STRING(500), comment: "评价标签" },
    totalrate: { type: Sequelize.FLOAT, comment: "好评率" },
    status: { type: Sequelize.TINYINT, comment: "状态", defaultValue: 0 },
    leavemessage: { type: Sequelize.STRING(1000), comment: "留言" },
    replymessage: { type: Sequelize.STRING(1000), comment: "回复留言" }
}, {
    freezeTableName: true
});
Evaluate.sync({ alter: true });
exports.default = Evaluate;
