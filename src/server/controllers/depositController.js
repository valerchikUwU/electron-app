const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const OrganizationCustomer = require('../../models/organizationCustomer');
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
                    where:
                    {
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
        title: "Список депозитов организаций",
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
        const err = new Error("Такая организация не найдена");
        err.status = 404;
        return next(err);
    }

    res.json({
        title: `История депозитов организации ${organization.organizationName}`,
        organization: organization,
        orders: orders,
    });
})



exports.deposit_create_get = asyncHandler(async (req, res, next) => {

    const [allOrganizations] = await Promise.all([
        OrganizationCustomer.findAll()
    ]);

    res.json({
        title: "Форма создания депозита",
        organizations: allOrganizations
    });
});

exports.deposit_create_post = [



    body("oraganizationName", "Должна быть указана организация")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("deposit")
        .optional({ checkFalsy: true })
        .escape(),
    body("withdraw")
        .optional({ checkFalsy: true })
        .escape(),
    body().custom((value, { req }) => {
        if (!req.body.withdraw && !req.body.deposit) {
            throw new Error('At least one of deposit or withdraw must be provided.');
        }
        return true;
    }),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const organizationCustomer = await OrganizationCustomer.findOne({
            where: { organizationName: req.body.organizationName }
        });
        const order = new Order({
            organizationCustomerId: organizationCustomer.id,
            status: 'Активный',
            dispatchDate: new Date(),
            createdBySupAdm: 1
        });
        console.log(order)
        const deposit = await Product.findOne({ where: { productTypeId: 4 } })
        const priceDef = await PriceDefinition.findOne({ where: { productId: deposit.id } })

        if (!errors.isEmpty()) {
            const [allOrganizations] = await Promise.all([
                OrganizationCustomer.findAll()
            ]);


            res.json({
                title: "Создание депозита",
                allOrganizations: allOrganizations,
                order: order,
                errors: errors.array(),
            });
        } 
        else {
            try {
                await order.save();
                await TitleOrders.create({
                    productId: deposit.id,
                    orderId: order.id,
                    quantity: req.body.deposit === null ? (req.body.withdraw * (-1)) : req.body.deposit,
                    priceDefId: priceDef.id
                });
            } catch (error) {
                console.error('Ошибка при сохранении заказа или создании записи в TitleOrders:', error);
                
                res.status(500).json({ message: 'Произошла ошибка при обработке запроса', error: error.message })
            };
            res.status(200).send('Депозит успешно создан!');
        }
    }),
];
