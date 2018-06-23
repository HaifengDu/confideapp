import * as Sequelize from "sequelize";
import sequelize from "../mysqlSeq";
import User from "./User";
import { IListener } from "../interface/model/IListener";

const Listener = sequelize.define<IListener,IListener>('mainlbale',{
    id: {type:Sequelize.INTEGER, primaryKey: true,autoIncrement:true,comment:"唯一id"},
    job:{type:Sequelize.TINYINT,comment:"职业"},
    family:{type:Sequelize.TINYINT,comment:"家庭"},
    edu:{type:Sequelize.TINYINT,comment:"学历"},
    resume:{type:Sequelize.TEXT,comment:"简历"},
    recivestatus:{type:Sequelize.TINYINT,comment:"接单状态"},
    isopentime:{type:Sequelize.STRING,comment:"接单时间"},
    status:{type:Sequelize.TINYINT,defaultValue:0,comment:"状态"}
},{
    freezeTableName: true
});
Listener.belongsTo(User);
Listener.sync();

export default Listener;