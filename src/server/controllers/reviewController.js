const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');
const PriceDefinition = require('../../models/priceDefinition');
const Product = require('../../models/product');


exports.review_details = asyncHandler(async (req, res, next) => {




})


async function getAllEarnings(){
    const orders = Order.findAll({
            where:
            {
                status:
                {
                    [Op.in]:
                        [
                            'Оплачен'
                        ]
                }
            },

            include:
                [
                    {
                        model: TitleOrders,
                        include:
                            [
                                {
                                    model: PriceDefinition,
                                    attributes: [],
                                    as: 'price'
                                },
                                {
                                    model: Product,
                                    attributes: [],
                                    as: 'product'
                                }
                            ],
                        attributes: []
                    }
                ],
            attributes:
            {
                include:
                    [
                        [
                            Sequelize.literal(`SUM(CASE WHEN productTypeId <> 4 AND addBooklet = TRUE THEN quantity * priceBooklet WHEN productTypeId <> 4 AND addBooklet = FALSE THEN quantity * priceAccess END)`), 'SUM'
                        ],
                        [
                            Sequelize.literal(`SUM(CASE WHEN productTypeId <> 4 THEN (quantity*1) END)`), 'totalQuantity'
                        ],
                        [
                            Sequelize.literal(`SUM(CASE WHEN productTypeId = 2 THEN (quantity*1) END)`), 'totalMainQuantity'
                        ]
                    ]
            },

            group: ['Order.id'],
            raw: true
        })

}