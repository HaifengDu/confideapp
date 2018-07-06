import * as Sequelize from "sequelize";
import sequelize from "../mysqlSeq";
import { IGeneralSetting } from "../interface/model/IGeneralSetting";
import Listener from "./Listener";

const GeneralSetting = sequelize.define<IGeneralSetting,IGeneralSetting>("generalsetting",{
    id: {type:Sequelize.INTEGER, primaryKey: true,autoIncrement:true,comment:"唯一id"},
    uid:{type:Sequelize.INTEGER,comment:"user外键",allowNull:false},
    position:{type:Sequelize.TINYINT,comment:"推广位置"},
    price:{type:Sequelize.FLOAT,comment:"推广单价"},
    status:{type:Sequelize.TINYINT,comment:"推广状态"}
},{
    freezeTableName: true
});
GeneralSetting.sync({alter:true});
GeneralSetting.belongsTo(Listener,{
    foreignKey:"uid"
});
export default GeneralSetting;