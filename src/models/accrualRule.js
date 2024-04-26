const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const AccrualRule = sequelize.define('AccrualRule', {

    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },

    commision: {
        type: DataTypes.DECIMAL,
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





}, {
    // Можно добавить дополнительные настройки модели здесь
});

module.exports = AccrualRule;