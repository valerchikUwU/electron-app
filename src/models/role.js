const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Role = sequelize.define('Role', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },

 roleName: {
    type: DataTypes.STRING,
    allowNull: false
 },

 roleDescription:{
    type: DataTypes.STRING,
    allowNull: false
 }
}, {
 // Можно добавить дополнительные настройки модели здесь
});

module.exports = Role;
