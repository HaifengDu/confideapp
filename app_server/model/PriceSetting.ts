import * as Sequelize from "sequelize";
import sequelize from "../mysqlSeq";
import { IPriceSetting } from "../interface/model/IPriceSetting";
import Listener from "./Listener";

const PriceSetting = sequelize.define<IPriceSetting,IPriceSetting>("pricesetting",{
    id: {type:Sequelize.INTEGER, primaryKey: true,autoIncrement:true,comment:"唯一id"},
    uid:{type:Sequelize.INTEGER,comment:"user外键",allowNull:false},
    type:{type:Sequelize.TINYINT,comment:"价格类型,1、文字;2、通话",allowNull:false,defaultValue:1},
    timecircle:{type:Sequelize.TINYINT,comment:"价格周期，1：15分中，2：30分钟，3：60分钟",allowNull:false},
    price:{type:Sequelize.FLOAT,comment:"单价",allowNull:false},
    taxprice:{type:Sequelize.FLOAT,comment:"含税价格",allowNull:false},
    status:{type:Sequelize.TINYINT,comment:"状态",allowNull:false,defaultValue:1}
},{
    freezeTableName: true
});
PriceSetting.sync({alter:true,force:true});
PriceSetting.belongsTo(Listener,{
    foreignKey:"uid"
});
export default PriceSetting;