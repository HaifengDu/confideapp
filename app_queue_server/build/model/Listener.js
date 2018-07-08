"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const mysqlSeq_1 = require("../mysqlSeq");
const User_1 = require("./User");
const Listener = mysqlSeq_1.default.define('listener', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, comment: "唯一id" },
    uid: { type: Sequelize.INTEGER, comment: "user外键", allowNull: false },
    job: { type: Sequelize.TINYINT, comment: "职业", allowNull: false },
    family: { type: Sequelize.TINYINT, comment: "家庭", allowNull: false },
    edu: { type: Sequelize.TINYINT, comment: "学历", allowNull: false },
    recievestatus: { type: Sequelize.TINYINT, defaultValue: 0, comment: "接单状态", allowNull: false },
    isopentime: { type: Sequelize.STRING, comment: "接单时间" },
    labelids: { type: Sequelize.STRING(500), defaultValue: "[]", comment: "倾听者标签:[1,2,3]" },
    labeldesc: { type: Sequelize.TEXT, defaultValue: "[]", comment: "倾听者描述:[{id:1,desc:'测试'}]" },
    expids: { type: Sequelize.STRING(500), defaultValue: "[]", comment: "倾听者经历:[1,2,3]" },
    expdesc: { type: Sequelize.TEXT, defaultValue: "[]", comment: "倾听者经历描述:[{id:1,desc:'测试'}]" },
    certificateurls: { type: Sequelize.STRING, comment: "资质图片" },
    authstatus: { type: Sequelize.TINYINT, defaultValue: 0, comment: "认证状态:[1,2,3]" },
    wchcount: { type: Sequelize.TINYINT, defaultValue: 0, comment: "当月文字价格设置次数" },
    cchcount: { type: Sequelize.TINYINT, defaultValue: 0, comment: "当月通话价格设置次数" },
    wchlastdate: { type: Sequelize.DATE, comment: "文字价格最后修改时间" },
    cchlastdate: { type: Sequelize.DATE, comment: "通话价格最后修改时间" },
    minprice: { type: Sequelize.FLOAT, comment: "最小价格" }
}, {
    freezeTableName: true
});
Listener.belongsTo(User_1.default, {
    foreignKey: "uid"
});
Listener.sync({ alter: true });
exports.default = Listener;
