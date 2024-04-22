

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('electron_storedb', 'root', 'kakashka90', {
 host: 'localhost',
 dialect: 'mysql',
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
