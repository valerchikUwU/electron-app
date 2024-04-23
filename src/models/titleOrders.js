const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const TitleOrders = sequelize.define('TitleOrders', {

   id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
   },


   accessType: {
      type: DataTypes.ENUM('Бумажный', 'Электронный'),
      allowNull: true
   },
   generation: {
      type: DataTypes.ENUM('Первое поколение', 'Второе поколение'),
      allowNull: true
   },


   addBooklet: {
      type: DataTypes.BOOLEAN,
      allowNull: true
   },

   quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
   }




},
   {
      // Можно добавить дополнительные настройки модели здесь
   });


module.exports = TitleOrders;