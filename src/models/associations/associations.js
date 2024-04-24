const Role = require('../role');
const Account = require('../account');
const OrganizationCustomer = require('../organizationCustomer');
const Payee = require('../payee');
const Order = require('../order');
const Product = require('../product');
const ProductType = require('../productType');
const PriceDefinition = require('../priceDefinition');
const TitleOrders = require('../titleOrders');
const AccrualRule = require('../accrualRule');
const CommisionReciever = require('../commisionReceiver');


const { DataTypes } = require('sequelize');






Role.hasMany(Account, {
   foreignKey: {
      name: 'roleId',
      type: DataTypes.INTEGER, // Использование UUID в качестве типа ключа
      allowNull: false, // Внешний ключ не может быть NULL
   },
   as: 'accounts'
});

Account.belongsTo(Role, {
   foreignKey: 'roleId',
   as: 'role' // Это позволит вам обращаться к роли через аккаунт, используя 'role'
});



OrganizationCustomer.hasMany(Order, {
   foreignKey: {
      name: 'organizationCustomerId',
      type: DataTypes.UUID, // Использование UUID в качестве типа ключа
      allowNull: false, // Внешний ключ не может быть NULL
   },
   as: 'orders'
});

Payee.hasMany(Order, {
   foreignKey: {
      name: 'payeeId',
      type: DataTypes.UUID, // Использование UUID в качестве типа ключа
      allowNull: false, // Внешний ключ не может быть NULL
   },
   as: 'orders'
});

Order.belongsTo(OrganizationCustomer, {
   foreignKey: 'organizationCustomerId',
   as: 'organization'
});

Order.belongsTo(Payee, {
   foreignKey: 'payeeId',
   as: 'payee'
});



ProductType.hasMany(Product, {
   foreignKey: {
      name: 'productTypeId',
      type: DataTypes.INTEGER, // Использование UUID в качестве типа ключа
      allowNull: false, // Внешний ключ не может быть NULL
   },
   as: 'products'
});

Product.belongsTo(ProductType, {
   foreignKey: 'productTypeId',
   as: 'productType'
});

Product.hasOne(PriceDefinition, { foreignKey: 'productId' });

PriceDefinition.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(TitleOrders, {
   foreignKey: {
      name: 'productId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'titles'
});

TitleOrders.belongsTo(Product, {
   foreignKey: 'productId',
   as: 'product'
});


Order.hasOne(TitleOrders, {
   foreignKey: {
      name: 'orderId',
      type: DataTypes.UUID,
      allowNull: false,
   }
});

TitleOrders.belongsTo(Order, {
   foreignKey: 'orderId'
});

PriceDefinition.hasMany(TitleOrders, {
   foreignKey: {
      name: 'priceDefId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'titles'
});

TitleOrders.belongsTo(PriceDefinition, {
   foreignKey: 'priceDefId',
   as: 'price'
});

Account.hasMany(Order, {
   foreignKey: {
      name: 'accountId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'orders'
});

Order.belongsTo(Account, {
   oreignKey: 'accountId',
   as: 'account'
})



ProductType.hasMany(AccrualRule, {
   foreignKey: {
      name: 'productTypeId',
      type: DataTypes.INTEGER, // Использование UUID в качестве типа ключа
      allowNull: false,
      defaultValue: 0  // Внешний ключ не может быть NULL
   },
   as: 'rules'
});

AccrualRule.belongsTo(ProductType, {
   foreignKey: 'productTypeId',
   as: 'productType'
});


Product.hasMany(AccrualRule, {
   foreignKey: {
      name: 'productId',
      type: DataTypes.UUID, // Использование UUID в качестве типа ключа
      allowNull: false,
      defaultValue: 0 // Внешний ключ не может быть NULL
   },
   as: 'rules'
});

AccrualRule.belongsTo(Product, {
   foreignKey: 'productId',
   as: 'product'
});

CommisionReciever.hasMany(AccrualRule, {
   foreignKey: {
      name: 'commisionRecieverId',
      type: DataTypes.UUID,
      allowNull: false,
   },
   as: 'rules'
});

AccrualRule.belongsTo(CommisionReciever, {
   foreignKey: 'commisionRecieverId',
   as: 'commisionReciever'
});

