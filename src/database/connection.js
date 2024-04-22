

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('co06635_acad', 'co06635_acad', 'kakashka90', {
 host: '185.114.245.193',
 port: 3306,
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
