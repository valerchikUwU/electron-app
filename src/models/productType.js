const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');


const ProductType = sequelize.define('ProductType', {

   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
   },

   name: {
      type: DataTypes.STRING,
      allowNull: false
   }


}, {
   // Можно добавить дополнительные настройки модели здесь
});

module.exports = ProductType;
