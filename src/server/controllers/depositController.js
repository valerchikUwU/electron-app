const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const OrganizationCustomer = require('../../models/organizationCustomer');
const { where, Sequelize } = require('sequelize');
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');
const Product = require('../../models/product');
const PriceDefinition = require('../../models/priceDefinition');


exports.deposits_list = asyncHandler(async (req, res, next) => {
    const organizations = await OrganizationCustomer.findAll({
        include: 
        [
            {
                model: Order,
                include: 
                [
                    {
                        model: TitleOrders,
                        include: 
                        [
                            {
                                model: PriceDefinition,
                                as: 'price',
                                attributes: 
                                [
                                    'priceAccess',
                                    'priceBooklet'
                                ]
                            },
                            {
                                model: Product,
                                attributes: 
                                [
                                    'productTypeId'
                                ],
                                as: 'product'
                            }
                        ],
                        attributes: 
                        [
                            'quantity', 
                            'addBooklet'
                        ],
                    }
                ],
                as: 'orders'
            }
        ],
        attributes: {
            include: [
                [
                    Sequelize.literal(`SUM(CASE WHEN productTypeId <> 4 AND addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`), 'SUM'
                ],
                
                [
                    Sequelize.literal(`CASE WHEN productTypeId = 4 THEN (SUM (quantity)) END`), 'allDeposits'
                ]
            ]
        },
        group: ['OrganizationCustomer.id'],
        raw: true
    });
    
    res.json({
        title: "organizations list",
        organizations: organizations
    });
});




async function getAllDeposits(organizationCustomerId){

}