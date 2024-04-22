const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const CommisionReciever = sequelize.define('CommisionReciever', {

  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
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

module.exports = CommisionReciever;