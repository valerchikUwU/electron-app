const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');



const Account = sequelize.define('Account', {

   id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
   },

   firstName: {
      type: DataTypes.STRING,
      allowNull: false
   },
   lastName: {
      type: DataTypes.STRING,
      allowNull: false
   },
   telephoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
   },
   telegramId: {
      type: DataTypes.STRING,
      allowNull: true
   },
   organizationList: {
      type: DataTypes.JSON,
      allowNull: true
   },

   isBlocked:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
   },

   lastSeen: {
      type: DataTypes.DATE,
      allowNull: true
   },
   accountNumber: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Указываем, что поле будет автоинкрементироваться
      unique: true, // Указываем, что значение поля должно быть уникальным
      allowNull: false // Указываем, что поле не может быть null
  }
},
   {
      // Можно добавить дополнительные настройки модели здесь
   });


module.exports = Account;
