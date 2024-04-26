const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');



const Order = sequelize.define('Order', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
        },


    dispatchDate:{
        type: DataTypes.DATE,
        allowNull: true
    },



    status:{
        type: DataTypes.ENUM('Черновик', 'Черновик депозита', 'Активный', 'Выставлен счёт', 'Оплачен','Отправлен','Получен','Отменен'),
        defaultValue: 'Черновик',
        allowNull: false
    },

    billNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },

    createdBySupAdm: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }

});




module.exports = Order;