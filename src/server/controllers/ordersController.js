const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');
const Account = require('../../models/account');
const OrganizationCustomer = require('../../models/organizationCustomer');
const Payee = require('../../models/payee');
const PriceDefinition = require('../../models/priceDefinition');
const Product = require('../../models/product');


exports.user_active_orders_list = asyncHandler(async (req, res, next) => {
    const accountId = req.params.accountId;
    const organizationList = await getOrganizationList(accountId);
    const { Sequelize, Op } = require('sequelize');

    const activeOrders = await Order.findAll({
        where: {
            accountId: accountId,
            status: {
                [Op.ne]: 'Получен'
            }
        },
        include: [
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
                    }
                ],
                attributes: ['quantity', 'addBooklet'] // Добавляем addBooklet в атрибуты
            },
            {
                model: OrganizationCustomer,
                as: 'organization'
            }
        ],
        attributes: {
            include: [
                [
                    Sequelize.literal(`SUM(CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`), 'SUM'
                ],
                [
                    Sequelize.literal(`organizationName`), 'organizationName'
                ]
            ]
        },
        group: ['Order.id'],
        raw: true
    });
    res.json({
        title: "active Orders list",
        orders_list: activeOrders,
        organizationList: organizationList
    })
});

exports.user_finished_orders_list = asyncHandler(async (req, res, next) => {
    const accountId = req.params.accountId;
    const finishedOrders = await Order.findAll({
        where: {

            accountId: accountId,
            status: 'Получен'
        },
        include: [
            {
                model: TitleOrders, // Добавляем модель TitleOrders
                include: [
                    {
                        model: PriceDefinition,
                        as: 'price',
                        attributes: ['priceAccess', 'priceBooklet']
                    }
                ],
                attributes: ['quantity']
            },
            {
                model: OrganizationCustomer,
                as: 'organization'
            }
        ],
        attributes: {
            include: [
                [
                    Sequelize.literal(`SUM(CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`), 'SUM'
                ],
                [
                    Sequelize.literal(`organizationName`), 'organizationName'
                ]
            ]
        },
        group: ['Order.id'], // Группируем результаты по id Order, чтобы суммирование работало корректно
        raw: true // Возвращаем сырые данные, так как мы используем агрегатные функции
    });
    res.json({
        title: "finished Orders list",
        orders_list: finishedOrders
    })
});




exports.admin_orders_list = asyncHandler(async (req, res, next) => {
    try {
        const orders = await Order.findAll({
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
                        model: Account,
                        as: 'account',
                        attributes: [],
                    },
                    {
                        model: TitleOrders, // Добавляем модель TitleOrders
                        include:
                            [
                                {
                                    model: PriceDefinition,
                                    as: 'price',
                                    attributes: []
                                },
                                {
                                    model: Product,
                                    attributes: [],
                                    as: 'product'
                                }
                            ],
                        attributes: []
                    },
                    {
                        model: OrganizationCustomer,
                        as: 'organization',
                        attributes: []
                    }
                ],
            attributes:
            {
                include:
                    [

                        [
                            Sequelize.literal(`CONCAT(account.firstName, ' ', account.lastName)`), 'fullName'
                        ],
                        [
                            Sequelize.literal(`SUM(CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`), 'SUM'
                        ],
                        [
                            Sequelize.literal(`organizationName`), 'organizationName'
                        ],
                        [
                            Sequelize.literal(`SUM(CASE WHEN productTypeId <> 4 THEN (quantity*1) END)`), 'totalQuantity'
                        ],
                        [
                            Sequelize.literal(`organizationList`), 'organizationList'
                        ]
                    ]
            },


            group: ['Order.id'], // Группируем результаты по id Order, чтобы суммирование работало корректно
            raw: true // Возвращаем сырые данные, так как мы используем агрегатные функции
        });


        res.json({
            title: "all Orders list",
            orders_list: orders
        });
    } catch (error) {
        // Обработка ошибок
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching orders' });
    }
});



exports.admin_archivedOrders_list = asyncHandler(async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where:
            {
                status:
                {
                    [Op.in]:
                        [
                            'Получен',
                            'Отменен'
                        ]
                }
            },


            include:
                [
                    {
                        model: Account,
                        as: 'account',
                        attributes:
                            [
                                'firstName',
                                'lastName'
                            ]
                    },
                    {
                        model: TitleOrders, // Добавляем модель TitleOrders
                        include:
                            [
                                {
                                    model: PriceDefinition,
                                    as: 'price',
                                    attributes:
                                        [
                                            'priceAccess', 'priceBooklet'
                                        ]
                                }
                            ],
                        attributes: ['quantity']
                    },
                    {
                        model: OrganizationCustomer,
                        as: 'organization'
                    }
                ],
            attributes:
            {
                include:
                    [

                        [
                            Sequelize.literal(`CONCAT(account.firstName, ' ', account.lastName)`), 'fullName'
                        ],
                        [
                            Sequelize.literal(`SUM(CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`), 'SUM'
                        ],
                        [
                            Sequelize.literal(`organizationName`), 'organizationName'
                        ]
                    ]
            },


            group: ['Order.id'], // Группируем результаты по id Order, чтобы суммирование работало корректно
            raw: true // Возвращаем сырые данные, так как мы используем агрегатные функции
        });


        res.json({
            title: "all Orders list",
            orders_list: orders
        });
    } catch (error) {
        // Обработка ошибок
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching orders' });
    }
});



// Display detail page for a specific book.
exports.user_order_detail = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances for specific book
    const [order, titles] = await Promise.all([
        Order.findByPk(req.params.orderId, {
            include:
                [
                    {
                        model: TitleOrders, // Добавляем модель TitleOrders
                        include:
                            [
                                {
                                    model: PriceDefinition,
                                    as: 'price',
                                    attributes:
                                        [
                                            'priceAccess', 'priceBooklet'
                                        ]
                                }
                            ],
                        attributes: ['quantity']
                    }
                ],
            attributes:
            {
                include:
                    [
                        [
                            Sequelize.literal(`SUM(CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`), 'SUM'
                        ],


                    ]
            },
        }),
        TitleOrders.findAll({
            where:
            {
                orderId: req.params.orderId
            },
            include:
                [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['abbreviation']
                    },
                    {
                        model: PriceDefinition,
                        as: 'price',
                        attributes:
                            [
                                'priceAccess', 'priceBooklet'
                            ]
                    }
                ],
            attributes:
            {
                include:
                    [
                        [
                            Sequelize.literal(`CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END`), 'SumForOneTitle'
                        ],

                        [
                            Sequelize.literal(`CASE WHEN addBooklet = TRUE THEN priceBooklet ELSE priceAccess END`), 'PriceForOneProduct'
                        ],
                    ]
            },
        })
    ]);

    if (order.id === null) {
        // No results.
        const err = new Error("order not found");
        err.status = 404;
        return next(err);
    }

    res.json({
        title: "orders details",
        order: order,
        titles: titles,
    });
});



exports.admin_order_detail = asyncHandler(async (req, res, next) => {
    const [order, titles] = await Promise.all([
        Order.findByPk(req.params.orderId, {
            include:
                [
                    {
                        model: TitleOrders, // Добавляем модель TitleOrders
                        include:
                            [
                                {
                                    model: PriceDefinition,
                                    as: 'price',
                                    attributes:
                                        [
                                            'priceAccess', 'priceBooklet'
                                        ]
                                }
                            ],
                        attributes: ['quantity']
                    },
                    {
                        model: OrganizationCustomer,
                        as: 'organization',
                        attributes: ['organizationName']
                    },
                    {
                        model: Payee,
                        as: "payee",
                        attributes: ['name']
                    }
                ],
            attributes:
            {
                include:
                    [
                        [
                            Sequelize.literal(`SUM(CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END)`), 'SUM'
                        ],
                        [
                            Sequelize.literal(`name`), 'payeeName'
                        ],
                        [
                            Sequelize.literal(`organizationName`), 'organizationName'
                        ]
                    ]
            }
        }),
        TitleOrders.findAll({
            where:
            {
                orderId: req.params.orderId
            },
            include:
                [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['abbreviation']
                    },
                    {
                        model: PriceDefinition,
                        as: 'price',
                        attributes:
                            [
                                'priceAccess',
                                'priceBooklet'
                            ]
                    }
                ],
            attributes:
            {
                include:
                    [
                        [
                            Sequelize.literal(`CASE WHEN addBooklet = TRUE THEN quantity * priceBooklet ELSE quantity * priceAccess END`), 'SumForOneTitle'
                        ],
                        [
                            Sequelize.literal(`CASE WHEN addBooklet = TRUE THEN priceBooklet ELSE priceAccess END`), 'PriceForOneProduct'
                        ]
                    ]
            }
        })
    ]);

    if (order === null) {
        // No results.
        const err = new Error("order not found");
        err.status = 404;
        return next(err);
    }

    res.json({
        title: "orders details",
        order: order,
        titles: titles,
    });
});













exports.user_order_create_post = [

    body("quantity")
        .isInt({ min: 1 })
        .withMessage('Должно быть больше 0')
        .escape(),
    body("organizationName")
        .if(body("organizationName").exists())
        .escape(),


    asyncHandler(async (req, res, next) => {

        if (!req.body) return res.sendStatus(400);
        const priceDefinition = await PriceDefinition.findOne({
            where: { productId: req.body.productId }
        });


        const productId = req.body.productId;
        const generation = req.body.generation;
        const accessType = req.body.addBooklet === true ? null : req.body.accessType;
        const addBooklet = req.body.addBooklet
        const quantity = req.body.quantity;
        const accountId = req.params.accountId;
        const organizationName = req.body.organizationName



        const isDepositProduct = await ifProductTypeDeposit(productId);
        if (isDepositProduct) {

            const draftOrder = await Order.findOne({ where: { status: 'Черновик депозита' }, raw: true })
            if(draftOrder !== null)
            {
                res.send('Измените черновик депозита!').redirect(`http://localhost:3000/api/${req.params.accountId}/orders/${draftOrder.id}`)
            }

            const organizationCustomerId = await OrganizationCustomer.findOne({
                where: { organizationName: organizationName }
            });
            const status = 'Черновик депозита';

            const order = await Order.create(
                {
                    status: status,
                    accountId: accountId,
                    organizationCustomerId: organizationCustomerId.id
                }
            ).catch(err => console.log(err));
            if (!order) {
                return res.status(500).send('ERROR CREATING ORDER');
            }


            await TitleOrders.create(
                {
                    productId: productId,
                    orderId: order.id,
                    accessType: accessType,
                    generation: generation,
                    addBooklet: addBooklet,
                    quantity: quantity,
                    priceDefId: priceDefinition.id
                }
            )
                .then(() => res.status(200).send('PRODUCT ADDED TO TITLES'))
                .catch(err => {
                    console.log(err);
                    res.status(500).send('ERROR CREATING TITLE');
                });


        }


        else if (await Order.findOne({ where: { status: 'Черновик' }, raw: true }) === null) {


            const firstOrganizationName = await getFirstOrganizationCustomerName(accountId)
            const organizationCustomerId = await OrganizationCustomer.findOne({
                where: { organizationName: firstOrganizationName }
            });
            const status = 'Черновик';
            const order = await Order.create(
                {
                    status: status,
                    accountId: accountId,
                    organizationCustomerId: organizationCustomerId.id,
                }
            ).catch(err => console.log(err));
            if (!order) {
                return res.status(500).send('ERROR CREATING ORDER');
            }


            await TitleOrders.create(
                {
                    productId: productId,
                    orderId: order.id,
                    accessType: accessType,
                    generation: generation,
                    addBooklet: addBooklet,
                    quantity: quantity,
                    priceDefId: priceDefinition.id
                }
            )
                .then(() => res.status(200).send('PRODUCT ADDED TO TITLES'))
                .catch(err => {
                    console.log(err);
                    res.status(500).send('ERROR CREATING TITLE');
                });
        }
        else {
            const order = await Order.findOne(
                {
                    where:
                    {
                        status: 'Черновик'
                    },
                    raw: true
                }
            );
            await TitleOrders.create(
                {
                    productId: productId,
                    orderId: order.id,
                    accessType: accessType,
                    generation: generation,
                    addBooklet: addBooklet,
                    quantity: quantity,
                    priceDefId: priceDefinition.id
                }
            )
                .then(() => res.status(200).send('PRODUCT ADDED TO TITLES'))
                .catch(err => {
                    console.log(err);
                    res.status(500).send('ERROR CREATING TITLE');
                });
        }
    }),
];


exports.admin_order_create_get = asyncHandler(async (req, res, next) => {

    const [allAccounts] = await Promise.all([
        Account.findAll()
    ]);

    // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
    res.json({
        title: "Create Order",
        accounts: allAccounts
    });
});

exports.admin_order_create_post = [

    

    body("accountId", "Account must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("organization", "organization must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("status", "Status must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("billNumber")
        .optional({ checkFalsy: true })
        .trim()
        .escape(),
    body("payeeId")
        .optional({ checkFalsy: true })
        .trim()
        .escape(),


    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        const order = new Order({
            accountId: req.body.accountId,
            organizationCustomerId: req.body.organizationCustomerId,
            dispatchDate: req.body.status === 'Отправлен' ? new Date() : null,
            status: req.body.status,
            billNumber: req.body.billNumber,
            payeeId: req.body.payeeId
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            const [allAccounts] = await Promise.all([
                Account.findAll()
            ]);


            res.json({
                title: "Create Order",
                allAccounts: allAccounts,
                order: order,
                errors: errors.array(),
            });
        } else {
            await order.save();
            res.redirect(`http://localhost:3000/api/${req.params.accountId}/orders/all`);
        }
    }),
];



exports.user_draftOrder_update_put = [



    // Validate and sanitize fields.

    body("organizationName")
        .if(body("organizationName").exists())
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const organizationName = req.body.organizationName;
        const organizationCustomerId = await OrganizationCustomer.findOne({
            where: { organizationName: organizationName }
        });
        const order = new Order({
            organizationCustomerId: organizationCustomerId.id,
            _id: req.params.orderId
        });

        if (!errors.isEmpty()) {
            const [allOrganizations] = await Promise.all([
                getOrganizationList(req.params.accountId)
            ]);


            res.json({
                title: "Update order",
                allOrganizations: allOrganizations,
                order: order,
                errors: errors.array(),
            });
            return;
        } else {
            const oldOrder = await Order.findByPk(req.params.orderId);
            if (oldOrder.status !== 'Черновик') {
                res.status(400).send('Редактировать можно только черновик')
            }
            oldOrder.organizationCustomerId = order.organizationCustomerId;
            oldOrder.status = 'Активный'
            await oldOrder.save();
            res.redirect(`http://localhost:3000/api/${req.params.accountId}/orders`);
        }
    }),
];











exports.admin_order_update_put = [


    // Validate and sanitize fields.

    body("organizationCustomerId", "organizationCustomerId must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("status", "status must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("billNumber")
        .optional({ checkFalsy: true })
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const order = new Order({
            organizationCustomerId: req.body.organizationCustomerId,
            status: req.body.status,
            billNumber: req.body.billNumber,
            dispatchDate: req.body.status === 'Отправлен' ? new Date() : null,
            _id: req.params.orderId
        });

        if (!errors.isEmpty()) {
            const [allOrganizations] = await Promise.all([
                getOrganizationList(req.params.accountId)
            ]);


            res.json({
                title: "Update order",
                allOrganizations: allOrganizations,
                order: order,
                errors: errors.array(),
            });
            return;
        } else {
            const oldOrder = await Order.findByPk(req.params.orderId);
            oldOrder.organizationCustomerId = order.organizationCustomerId;
            oldOrder.status = order.status;
            oldOrder.billNumber = order.billNumber;
            await oldOrder.save();
            res.redirect('http://localhost:3000/api/:accountId/orders/all');
        }
    }),
];








async function getOrganizationList(accountId) {
    try {
        const account = await Account.findByPk(accountId);
        if (!account) {
            throw new Error('Account not found');
        }
        return account.organizationList;
    } catch (error) {
        console.error(error);
    }
}



async function getFirstOrganizationCustomerName(accountId) {
    try {
        const account = await Account.findOne({
            where: {
                id: accountId
            }
        });
        if (account) {
            // Предполагаем, что organizationList уже является JSON-массивом
            // Мы можем напрямую обращаться к его элементам
            const organizationsList = account.organizationList;
            const firstOrganization = organizationsList[0];
            console.log(firstOrganization);
            return firstOrganization;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching org list:', error);
        return null;
    }
}

async function ifProductTypeDeposit(productId) {
    const product = await Product.findByPk(productId);
    const productTypeId = parseInt(product.productTypeId, 10);
    console.log(productTypeId);
    if (productTypeId === 4) {
        return true;
    }
    else return false;
}


// async function createTitleOrder(productId, orderId, accessType, generation, addBooklet, quantity, priceDefId) {
//     try {
//         await TitleOrders.create({
//             productId: productId,
//             orderId: orderId,
//             accessType: accessType,
//             generation: generation,
//             addBooklet: addBooklet,
//             quantity: quantity,
//             priceDefId: priceDefId
//         });
//         return true;
//     } catch (err) {
//         console.error('ERROR CREATING TITLE:', err);
//         return false;
//     }
// }
