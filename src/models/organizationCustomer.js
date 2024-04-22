const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const OrganizationCustomer = sequelize.define('OrganizationCustomer', {

    id: {
       type: Sequelize.UUID,
       defaultValue: Sequelize.UUIDV4,
       primaryKey: true,
       allowNull: false
    },

    organizationName: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
   // Можно добавить дополнительные настройки модели здесь
});


module.exports = OrganizationCustomer;
