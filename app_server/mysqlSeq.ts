// const Sequelize = require('sequelize');
import * as Sequelize from "sequelize";
const sequelize = new Sequelize('confide', 'root', 'dkl20170531', {
    host: '39.106.100.155',
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