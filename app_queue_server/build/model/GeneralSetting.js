"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysqlSeq_1 = require("../mysqlSeq");
const Listener_1 = require("./Listener");
const GeneralSetting = mysqlSeq_1.default.define("generalsetting", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, comment: "唯一id" },
    uid: { type: Sequelize.INTEGER, comment: "user外键", allowNull: false },
    position: { type: Sequelize.TINYINT, comment: "推广位置" },
    price: { type: Sequelize.FLOAT, comment: "推广单价" },
    status: { type: Sequelize.TINYINT, comment: "推广状态" }
}, {
    freezeTableName: true
});
GeneralSetting.sync({ alter: true });
GeneralSetting.belongsTo(Listener_1.default, {
    foreignKey: "uid"
});
exports.default = GeneralSetting;
