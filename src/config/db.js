const Sequelize = require('sequelize');
const sequelize = new Sequelize('upTask', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306',
    operatorsAliases: 0,
    define: {
        timestamps: false
    },
    pool: {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 10000,
    }
});

export default sequelize;