const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');


const Payee = sequelize.define('Payee', {
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
})


module.exports = Payee;