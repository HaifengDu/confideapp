import * as Sequelize from "sequelize";
import sequelize from "../mysqlSeq";
import { IOrder } from "../interface/model/IOrder";
const Order = sequelize.define<IOrder,IOrder>('order',{
    id: {type:Sequelize.INTEGER(11) ,primaryKey: true,autoIncrement:true,comment:"唯一id"},
    wxorderid: {type:Sequelize.STRING(100),comment:"微信订单id"},
    uid:{type:Sequelize.TINYINT,comment:"用户id",allowNull:false},
    lid:{type:Sequelize.TINYINT,comment:"倾听者id，购买者",allowNull:false},
    uprice:{type:Sequelize.FLOAT,comment:"单价",allowNull:false},
    totalprice:{type:Sequelize.FLOAT,comment:"总计",allowNull:false},
    payprice:{type:Sequelize.FLOAT,comment:"支付金额",allowNull:false},
    balance:{type:Sequelize.FLOAT,comment:"支付所用余额"},
    paytype:{type:Sequelize.TINYINT,comment:"支付类型",allowNull:false},
    source:{type:Sequelize.TINYINT,comment:"订单来源",allowNull:false},
    servicetype:{type:Sequelize.TINYINT,comment:"服务类型",allowNull:false},
    servicetime:{type:Sequelize.FLOAT,comment:"服务时长",defaultValue:0},
    payservicetime:{type:Sequelize.FLOAT,comment:"购买时长",allowNull:false},
    useragent:{type:Sequelize.STRING(500),comment:"代理头",allowNull:false},
    ip:{type:Sequelize.STRING(100),comment:"ip",allowNull:false},
    status:{type:Sequelize.TINYINT,comment:"订单状态",allowNull:false},
    completetype:{type:Sequelize.TINYINT,comment:"完成类型"},
    comment:{type:Sequelize.STRING(1000),comment:"备注"},
    ctime:{type:Sequelize.DATE,comment:"创建时间",allowNull:false},
    paytime:{type:Sequelize.DATE,comment:"支付时间"},
    paidtime:{type:Sequelize.DATE,comment:"支付完成时间"},
    completedtime:{type:Sequelize.DATE,comment:"完成时间"},
    evaluatetime:{type:Sequelize.DATE,comment:"评价时间"},
    canceltime:{type:Sequelize.DATE,comment:"取消时间"}
},{
    freezeTableName: true
});

Order.sync({force:true});

export default Order;