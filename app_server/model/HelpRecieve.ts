import * as Sequelize from "sequelize";
import sequelize from "../mysqlSeq";
import { IHelpRecieve } from "../interface/model/IHelpRecieve";
import User from "./User";
const HelpRecieve = sequelize.define<IHelpRecieve,IHelpRecieve>("helprecieve",{
    id:{type:Sequelize.INTEGER, primaryKey: true,autoIncrement:true,comment:"唯一id"},
    uid:{type:Sequelize.INTEGER,comment:"user外键",allowNull:false},
    helpid:{type:Sequelize.INTEGER,comment:"求助外键",allowNull:false},
    likecount:{type:Sequelize.INTEGER,comment:"悬赏金额",defaultValue:0},
    status:{type:Sequelize.TINYINT,comment:"状态",defaultValue:0},
    content:{type:Sequelize.TEXT,comment:"内容"},
    recieveid:{type:Sequelize.INTEGER,comment:"回复id",defaultValue:-1}
},{
    freezeTableName: true
});
HelpRecieve.belongsTo(User,{
    foreignKey:"uid"
});
HelpRecieve.sync({force:true})

export default HelpRecieve;