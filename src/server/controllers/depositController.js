const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const OrganizationCustomer = require('../../models/organizationCustomer');
const { where, Sequelize } = require('sequelize');
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');
const Product = require('../../models/product');


exports.deposits_list = asyncHandler(async (req, res, next) => {
    const organizations = await OrganizationCustomer.findAll({
        include: [
            {
                model: Order,
                include: [
                    {
                        model: TitleOrders,
                        include: [
                            {
                                model: Product,
                                attributes: ['productTypeId'],
                                as: 'product'
                            }
                        ],
                        attributes: ['quantity']
                    }
                ],
                as: 'orders'
            }
        ],
        attributes: {
            include: [
                [
                    Sequelize.literal(`(SUM(CASE WHEN productTypeId = 4 THEN quantity))-(SUM(CASE WHEN productTypeId <> 4 THEN quantity))`), 'allDeposits'
                ]
            ]
        }
    });
    
    res.json({
        title: "organizations list",
        organizations: organizations
    });
});




async function getAllDeposits(organizationCustomerId){

}