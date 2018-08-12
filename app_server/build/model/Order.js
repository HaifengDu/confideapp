"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysqlSeq_1 = require("../mysqlSeq");
const User_1 = require("./User");
const Order = mysqlSeq_1.default.define('order', {
    id: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, comment: "唯一id" },
    wxorderid: { type: Sequelize.STRING(100), comment: "微信订单id" },
    uid: { type: Sequelize.INTEGER, comment: "用户id", allowNull: false },
    lid: { type: Sequelize.INTEGER, comment: "倾听者id，购买者", allowNull: false },
    uprice: { type: Sequelize.FLOAT, comment: "单价", allowNull: false },
    totalprice: { type: Sequelize.FLOAT, comment: "总计", allowNull: false },
    payprice: { type: Sequelize.FLOAT, comment: "支付金额", allowNull: false },
    balance: { type: Sequelize.FLOAT, comment: "支付所用余额" },
    paytype: { type: Sequelize.TINYINT, comment: "支付类型", allowNull: false },
    source: { type: Sequelize.TINYINT, comment: "订单来源", allowNull: false },
    servicetype: { type: Sequelize.TINYINT, comment: "服务类型", allowNull: false },
    servicetime: { type: Sequelize.FLOAT, comment: "服务时长", defaultValue: 0 },
    payservicetime: { type: Sequelize.FLOAT, comment: "购买时长", allowNull: false },
    useragent: { type: Sequelize.STRING(500), comment: "代理头", allowNull: false },
    ip: { type: Sequelize.STRING(100), comment: "ip", allowNull: false },
    status: { type: Sequelize.TINYINT, comment: "订单状态", allowNull: false },
    completetype: { type: Sequelize.TINYINT, comment: "完成类型" },
    comment: { type: Sequelize.STRING(1000), comment: "备注" },
    ctime: { type: Sequelize.DATE, comment: "创建时间", allowNull: false },
    paytime: { type: Sequelize.DATE, comment: "支付时间" },
    srefoundtime: { type: Sequelize.DATE, comment: "开始退款时间" },
    erefoundtime: { type: Sequelize.DATE, comment: "完成退款时间" },
    paidtime: { type: Sequelize.DATE, comment: "支付完成时间" },
    completedtime: { type: Sequelize.DATE, comment: "完成时间" },
    evaluatetime: { type: Sequelize.DATE, comment: "评价时间" },
    canceltime: { type: Sequelize.DATE, comment: "取消时间" }
}, {
    freezeTableName: true,
    initialAutoIncrement: "1000000"
});
Order.belongsTo(User_1.default, {
    foreignKey: "uid",
    as: "cuser"
});
Order.belongsTo(User_1.default, {
    foreignKey: "lid",
    as: "luser"
});
// Order.sync({force:true});
exports.default = Order;
