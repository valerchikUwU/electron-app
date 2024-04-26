const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const OrganizationCustomer = require('../../models/organizationCustomer');
const { where, Op, Sequelize } = require('sequelize');
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
                    where: {
                        status:
                        {
                            [Op.notIn]:
                                [
                                    'Получен',
                                    'Черновик',
                                    'Черновик депозита',
                                    'Отменен'
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
                                attributes: [],
                            }
                        ],
                    as: 'orders'
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
                        Sequelize.literal(`SUM(CASE WHEN productTypeId = 4 THEN (quantity*1) END) `), 'allDeposits'
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



exports.deposits_details = asyncHandler(async (req, res, next) => {
    const [organization, orders] = await Promise.all([
        await OrganizationCustomer.findByPk(req.params.organizationCustomerId),
        Order.findAll({
            where:
            {
                organizationCustomerId: req.params.organizationCustomerId,
                status:
                {
                    [Op.notIn]:
                        [
                            'Получен',
                            'Черновик',
                            'Черновик депозита',
                            'Отменен'
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
                            Sequelize.literal(`CASE WHEN productTypeId <> 4 AND addBooklet = TRUE THEN quantity * priceBooklet WHEN productTypeId <> 4 AND addBooklet = FALSE THEN quantity * priceAccess END`), 'Spisanie'
                        ],

                        [
                            Sequelize.literal(`CASE WHEN productTypeId = 4 THEN (quantity*1) END `), 'Deposit'
                        ],
                        [
                            Sequelize.literal(`billNumber`), 'billNumber'
                        ]
                    ]
            },

            group: ['Order.id'],
            raw: true
        })
    ]);


    if (organization.id === null) {
        // No results.
        const err = new Error("organization not found");
        err.status = 404;
        return next(err);
    }

    res.json({
        title: "deposits details",
        organization: organization,
        orders: orders,
    });
})



exports.deposit_create_get = asyncHandler(async (req, res, next) => {

    const [allOrganizations] = await Promise.all([
        OrganizationCustomer.findAll()
    ]);

    // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
    res.json({
        title: "Create deposit",
        organizations: allOrganizations
    });
});

exports.deposit_create_post = [



    body("organizationCustomerId", "Organization must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("deposit")
        .escape(),
    body("withdraw")
        .escape(),
    body().custom((value, { req }) => {
        if (!req.body.withdraw && !req.body.deposit) {
            throw new Error('At least one of deposit or withdraw must be provided.');
        }
        // Возвращаем true, если условие выполнено
        return true;
    }),


    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create a Book object with escaped and trimmed data.
        const order = new Order({
            organizationCustomerId: req.body.organizationCustomerId,
            status: 'Активный',
            createdBySupAdm: true
        });
        console.log(order)
        const deposit = await Product.findOne({where: {productTypeId: 4}})
        const priceDef = await PriceDefinition.findOne({where: {productId: deposit.id}})

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            const [allOrganizations] = await Promise.all([
                OrganizationCustomer.findAll()
            ]);


            res.json({
                title: "Create deposit",
                allOrganizations: allOrganizations,
                order: order,
                errors: errors.array(),
            });
        } else {
            try {
                await order.save();
                await TitleOrders.create({
                    productId: deposit.id,
                    orderId: order.id,
                    quantity: req.body.deposit === '' ? (req.body.withdraw * (-1)) : req.body.deposit,
                    priceDefId: priceDef.id
                });
            } catch (error) {
                console.error('Ошибка при сохранении заказа или создании записи в TitleOrders:', error);
                // Здесь можно добавить дополнительную логику обработки ошибок, например, отправку ответа с ошибкой клиенту
                res.status(500).json({ message: 'Произошла ошибка при обработке запроса', error: error.message })};
                //не работает редирект
            res.redirect(`http://localhost:3000/api/:accountId/deposits/${req.params.organizationCustomerId}`);
        }
    }),
];
