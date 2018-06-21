// const Sequelize = require('sequelize');
import * as Sequelize from "sequelize";
const sequelize = new Sequelize('aw_api', 'root', 'dkl20170531', {
    host: '47.93.50.205',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export default sequelize;