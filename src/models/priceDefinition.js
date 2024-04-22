const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');


const PriceDefinition = sequelize.define('PriceDefinition', {

    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },

 activationDate: {
    type: DataTypes.DATE,
    allowNull: false
 },


 priceAccess:{
    type: DataTypes.DECIMAL,
    allowNull: false
 },

 priceBooklet:{
    type: DataTypes.DECIMAL,
    allowNull: false
 }


}, {
 // Можно добавить дополнительные настройки модели здесь
});




module.exports = PriceDefinition;
