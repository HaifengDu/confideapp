import * as Sequelize from "sequelize";
import sequelize from "../mysqlSeq";
import { IGeneralSetting } from "../interface/model/IGeneralSetting";
import User from "./User";

const GeneralSetting = sequelize.define<IGeneralSetting,IGeneralSetting>("generalsetting",{
    id: {type:Sequelize.INTEGER, primaryKey: true,autoIncrement:true,comment:"唯一id"},
    uid:{type:Sequelize.INTEGER,comment:"user外键",allowNull:false},
    position:{type:Sequelize.TINYINT,comment:"推广位置"},
    price:{type:Sequelize.FLOAT,comment:"推广单价"},
    dayprice:{type:Sequelize.FLOAT,defaultValue:0,comment:"当日已推广金额"},
    limitprice:{type:Sequelize.FLOAT,comment:"当日推广限制金额"},
    status:{type:Sequelize.TINYINT,comment:"推广状态"}
},{
    freezeTableName: true
});
GeneralSetting.belongsTo(User,{
    foreignKey:"uid"
});
GeneralSetting.sync({alter:true});
export default GeneralSetting;