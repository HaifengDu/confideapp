import * as Sequelize from "sequelize";
import sequelize from "../mysqlSeq";
import { IHelp } from "../interface/model/IHelp";
import User from "./User";
const Help = sequelize.define<IHelp,IHelp>("help",{
    id:{type:Sequelize.INTEGER, primaryKey: true,autoIncrement:true,comment:"唯一id"},
    uid:{type:Sequelize.INTEGER,comment:"user外键",allowNull:false},
    labelid:{type:Sequelize.INTEGER,comment:"求助标签外键",allowNull:false},
    money:{type:Sequelize.FLOAT,comment:"悬赏金额",defaultValue:0},
    status:{type:Sequelize.TINYINT,comment:"状态",defaultValue:0},
    content:{type:Sequelize.TEXT,comment:"内容"},
    recieveid:{type:Sequelize.INTEGER,comment:"回复id",}
},{
    freezeTableName: true
});
Help.belongsTo(User,{
    foreignKey:"uid"
});
Help.sync({force:true});

export default Help;