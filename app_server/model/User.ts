import * as Sequelize from "sequelize";
import sequelize from "../mysqlSeq";
import { IUser } from "../interface/model/IUser";
const User = sequelize.define<IUser,IUser>('user',{
    id: {type:Sequelize.INTEGER, primaryKey: true,autoIncrement:true},
    weixinid: Sequelize.STRING(50),
    sex:Sequelize.TINYINT,
    birthday:Sequelize.DATE,
    address:Sequelize.STRING,
    role:Sequelize.TINYINT,
    status:{type:Sequelize.TINYINT,defaultValue:0},
    follow:Sequelize.STRING(500)
},{
    freezeTableName: true
});

export default User;