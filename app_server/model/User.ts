import * as Sequelize from "sequelize";
import sequelize from "../mysqlSeq";
import { IUser } from "../interface/model/IUser";
import Listener from "./Listener";
import MainLabel from "./MainLabel";
const User = sequelize.define<IUser,IUser>('user',{
    id: {type:Sequelize.INTEGER, primaryKey: true,autoIncrement:true,comment:"唯一id"},
    weixinid: {type:Sequelize.STRING(100),allowNull:false,comment:"微信id"},
    sex:{type:Sequelize.TINYINT,comment:"性别：1、男；2、女",allowNull:false},
    birthday:Sequelize.DATE,
    phone:{type:Sequelize.STRING,comment:"电话号码"},
    phonebindstatus:{type:Sequelize.TINYINT,comment:"电话绑定状态"},
    address:Sequelize.STRING,
    nickname:{type:Sequelize.STRING,comment:"别名"},
    role:{type:Sequelize.TINYINT,comment:"角色：1、倾诉者，2、倾听者"},
    headimgurl:{type:Sequelize.STRING,comment:"头像"},
    status:{type:Sequelize.TINYINT,defaultValue:0},
    follow:{type:Sequelize.STRING(500),comment:"关注ids"},
    resume:{type:Sequelize.TEXT,comment:"简历"}
},{
    freezeTableName: true
});

User.sync({alter:true});
export default User;