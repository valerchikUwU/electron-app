
require('dotenv').config();
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.db_name, process.env.db_user, process.env.password, {
 host: process.env.host,
 port: process.env.port,
 timezone: '+03:00',
 dialect: 'mysql'
});

async function checkDatabaseConnection() {
    try {
       await sequelize.authenticate();
       console.log('Connection has been established successfully.');
    } catch (error) {
       console.error('Unable to connect to the database:', error);
    }
   }
   
   // Вызов асинхронной функции
   checkDatabaseConnection();

module.exports = sequelize;
