const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');
const Account = require('../../models/account');
const OrganizationCustomer = require('../../models/organizationCustomer');
const Payee = require('../../models/payee');
const PriceDefinition = require('../../models/priceDefinition');
const Product = require('../../models/product');


exports.user_active_orders_list = asyncHandler(async (req, res, next) => {
    const accountId = req.params.accountId;
    const allOrders = await Order.findAll({
        where: { status: { [Op.ne]: 'Получен' }, accountId: accountId },
        raw: true
    });
    res.json({
        title: "active Orders list",
        orders_list: allOrders
    })
});

exports.user_finished_orders_list = asyncHandler(async (req, res, next) => {
    const accountId = req.params.accountId;
    const allOrders = await Order.findAll({ where: { status: 'Получен', accountId: accountId }, raw: true });
    res.json({
        title: "finished Orders list",
        orders_list: allOrders
    })
});


exports.admin_orders_list = asyncHandler(async (req, res, next) => {
    const [allOrders] = await Promise.all([
        Order.findAll({
            where: { status: { [Op.ne]: 'Получен' } },
            include: [
                {
                    model: Account,
                    attributes: ['firstName', 'lastName'] // Указываем, какие поля из Account нужно включить
                },
                {
                    model: TitleOrders, // Добавляем модель TitleOrders
                    attributes: [] // Не включаем price напрямую, так как мы будем использовать агрегатную функцию
                }
            ],
            attributes: {
                include: [
                    [fn('SUM', col('TitleOrders.price')), 'totalPrice'],
                    [fn('SUM', col('TitleOrders.quantity')), 'totalQuantity']
                ]
            },
            group: ['Order.id'], // Группируем результаты по id Order, чтобы суммирование работало корректно
            raw: true // Возвращаем сырые данные, так как мы используем агрегатные функции
        }).exec(),
    ]);
    res.json({
        title: "all Orders list",
        orders_list: allOrders
    })
})




// Display detail page for a specific book.
exports.user_order_detail = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances for specific book
    const [order, titles] = await Promise.all([
        Order.findByPk(req.params.orderId, {
            include: [
                { model: Account, as: 'account' },
                { model: OrganizationCustomer, as: 'organization' }
            ]
        }),
        TitleOrders.findAll({
            where: { orderId: req.params.id }, include: [
                {
                    model: Product,
                    attributes: ['abbreviation']
                },
                {
                    model: PriceDefinition,
                    attributes: ['priceAccess', 'priceBooklet']
                }]
        }).exec(),
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



exports.admin_order_detail = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances for specific book
    const [order, titles] = await Promise.all([
        Order.findByPk(req.params.orderId, {
            include: [
                { model: Account, as: 'account' },
                { model: OrganizationCustomer, as: 'organization' },
                { model: Payee, as: "payee" }
            ]
        }),
        TitleOrders.findAll({
            where: { orderId: req.params.orderId }, include: [
                {
                    model: Product,
                    attributes: ['abbreviation']
                },
                {
                    model: PriceDefinition,
                    attributes: ['priceAccess', 'priceBooklet']
                }]
        }).exec(),
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



    asyncHandler(async (req, res, next) => {

        if (!req.body) return res.sendStatus(400);
        const priceDefinition = await PriceDefinition.findOne({
            where: { productId: req.params.id }
        });
        const productId = req.body.productId;
        const accessType = req.body.accessType;
        const generation = req.body.generation;
        const addBooklet = req.body.addBooklet;
        const quantity = req.body.quantity;
        if (await Order.findOne({ where: { status: 'Черновик' }, raw: true }) === null) {
            const status = 'Черновик';
            const accountId = req.params.accountId;
            const organizationCustomerId = await OrganizationCustomer.findOne({
                where: { name: getOrganizationCustomerName(accountId) }
            });
            const order = await Order.create({ status: status, accountId: accountId, organizationCustomerId: organizationCustomerId }).catch(err => console.log(err));
            if (!order) {
                return res.status(500).send('ERROR CREATING ORDER');
            }


            await TitleOrders.create({ productId: productId, orderId: order.id, accessType: accessType, generation: generation, addBooklet: addBooklet, quantity: quantity, priceDefId: priceDefinition.id })
                .then(() => res.status(200).send('PRODUCT ADDED TO TITLES'))
                .catch(err => {
                    console.log(err);
                    res.status(500).send('ERROR CREATING TITLE');
                });
        }
        else {
            const order = await Order.findOne({ where: { status: 'Черновик' }, raw: true });
            await TitleOrders.create({ productId: productId, orderId: order.id, accessType: accessType, generation: generation, addBooklet: addBooklet, quantity: quantity, priceDefId: priceDefinition.id })
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

    (req, res, next) => {
        if (!Array.isArray(req.body.accounts)) {
            req.body.accounts =
                typeof req.body.accounts === "undefined" ? [] : [req.body.accounts];
        }
        next();
    },

    body("accountId", "Account must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("organization", "organization must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("dispatchDate")
        .optional({ checkFalsy: true })
        .trim()
        .escape(),
    body("status", "Status must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("billNumber")
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
            dispatchDate: req.body.dispatchDate,
            status: req.body.status,
            billNumber: req.body.billNumber,
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
            res.redirect('http://localhost:3000/api/:accountId/orders/all');
        }
    }),
];






exports.admin_order_update_get = asyncHandler(async (req, res, next) => {
    const [order, allOrganizations] = await Promise.all([
        Order.findByPk(req.params.id, {
            include: [
                { model: Account, as: 'account' },
                { model: OrganizationCustomer, as: 'organization' },
                { model: Payee, as: 'payee' }
            ]
        }),
        getOrganizationList(req.params.accountId)
    ]);

    if (!order) {
        const err = new Error("order not found");
        err.status = 404;
        return next(err);
    }



    res.json({
        title: "Update order",
        order: order,
        allOrganizations: allOrganizations
    });
});


exports.admin_order_update_post = [


    // Validate and sanitize fields.

    body("organizationCustomerId", "organizationCustomerId must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const order = new Order({
            organizationCustomerId: req.body.organizationCustomerId,
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
            const oldOrder = await Order.findByPk(req.params.id);
            oldOrder.organizationCustomerId = order.organizationCustomerId;
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



async function getOrganizationCustomerName(accountId) {
    try {
        const account = await Account.findOne({
            where: {
                id: accountId
            }
        });
        if (account) {
            const organizationsList = JSON.parse(account.organizationsList);
            const firstOrganization = organizationsList[0];
            return firstOrganization;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching telephone number:', error);
        return null;
    }
}