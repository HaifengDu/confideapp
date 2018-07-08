import * as Sequelize from "sequelize";
import sequelize from "../mysqlSeq";
import { IMainLabel } from "../interface/model/IMainLabel";

const MainLabel = sequelize.define<IMainLabel,IMainLabel>('mainlable',{
    id: {type:Sequelize.INTEGER, primaryKey: true,autoIncrement:true,comment:"唯一id"},
    name:{type:Sequelize.STRING,allowNull:false,comment:"名称"},
    cuid:{type:Sequelize.INTEGER,comment:"创建人id"},
    ctype:{type:Sequelize.TINYINT,defaultValue:0,comment:"创建类型：0、系统；1、用户自定义",allowNull:false},
    stype:{type:Sequelize.TINYINT,defaultValue:0,comment:"系统类型：0、用户标签;1、经历"},
    status:{type:Sequelize.TINYINT,defaultValue:0,comment:"状态:-1、删除，0：正常，1：审核",allowNull:false}
},{
    freezeTableName: true
});
export default MainLabel;