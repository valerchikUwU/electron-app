const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, and, Op, fn, col } = require('sequelize');
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');
const PriceDefinition = require('../../models/priceDefinition');





exports.user_titleOrder_update_put = [




    // Validate and sanitize fields.
    body("productId", "productId must be chosen")
        .if(body("productId").exists())
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("accessType", "accessType must be choses")
        .if(body("accessType").exists())
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("generation", "generation must be chosen")
        .if(body("generation").exists())
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("quantity", "quantity must be written")
        .if(body("quantity").exists())
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("addBooklet")
        .if(body("addBooklet").exists())
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);


        const titlesToUpdate = req.body.titlesToUpdate;
        console.log(titlesToUpdate);
        if (!errors.isEmpty()) {
            const [order, titleOrders] = await Promise.all([
                Order.findByPk(req.params.orderId),
                TitleOrders.findAll({ where: { orderId: req.params.orderId } })
            ]);


            res.json({
                title: "Update titles of order",
                titleOrders: titleOrders,
                order: order,
                errors: errors.array(),
            });
            return;
        } else {

            for (const title of titlesToUpdate) {
                const oldTitle = await TitleOrders.findByPk(title.id);
                if (oldTitle) {
                    // Проверяем, были ли предоставлены новые значения для полей
                    if (title.addBooklet !== undefined && title.addBooklet === 0) {
                        oldTitle.addBooklet = title.addBooklet;
                        oldTitle.accessType = null;
                    }
                    else {
                        if (title.accessType)
                            oldTitle.accessType = title.accessType;
                    }
                    if (title.productId){
                        oldTitle.productId = title.productId;
                        const priceDef = await PriceDefinition.findOne({where: {productId: title.productId}});
                        oldTitle.priceDefId = priceDef.id
                    }

                    if (title.generation)
                        oldTitle.generation = title.generation;

                    if (title.quantity)
                        oldTitle.quantity = title.quantity;

                    console.log(oldTitle);
                    await oldTitle.save();
                }
            }
            res.status(200).send('Titles successfully updated');
        }
    }),
];



exports.title_delete = asyncHandler(async (req, res, next) => {

    const title = await TitleOrders.findByPk(req.params.titleId);

    if (title === null) {
        // No results.
        res.status(404).send('Title not found');
    }

    await TitleOrders.destroy({where: {id: req.params.titleId}});
    res.status(200).send('Title destroyed');

});


exports.admin_titleOrder_update_put = [




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
    body("productId", "productId must be chosen")
        .if(body("productId").exists())
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("accessType", "accessType must be choses")
        .if(body("accessType").exists())
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("generation", "generation must be chosen")
        .if(body("generation").exists())
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("quantity", "quantity must be written")
        .if(body("quantity").exists())
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("addBooklet")
        .if(body("addBooklet").exists())
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);


        const titlesToUpdate = req.body.titlesToUpdate;
        console.log(titlesToUpdate);
        if (!errors.isEmpty()) {
            const [order, titleOrders] = await Promise.all([
                Order.findByPk(req.params.orderId),
                TitleOrders.findAll({ where: { orderId: req.params.orderId } })
            ]);


            res.json({
                title: "Update titles of order",
                titleOrders: titleOrders,
                order: order,
                errors: errors.array(),
            });
            return;
        } else {

            const order = new Order({
                organizationCustomerId: req.body.organizationCustomerId,
                status: req.body.status,
                billNumber: req.body.billNumber,
                _id: req.params.orderId
            });

            const oldOrder = await Order.findByPk(req.params.orderId);
            oldOrder.organizationCustomerId = order.organizationCustomerId;
            oldOrder.status = order.status;
            oldOrder.billNumber = order.billNumber;
            await oldOrder.save();


            for (const title of titlesToUpdate) {
                const oldTitle = await TitleOrders.findByPk(title.id);
                if (oldTitle) {
                    // Проверяем, были ли предоставлены новые значения для полей
                    if (title.addBooklet !== undefined && title.addBooklet === 0) {
                        oldTitle.addBooklet = title.addBooklet;
                        oldTitle.accessType = null;
                    }
                    else {
                        if (title.accessType)
                            oldTitle.accessType = title.accessType;
                    }
                    if (title.productId)
                        oldTitle.productId = title.productId;

                    if (title.generation)
                        oldTitle.generation = title.generation;

                    if (title.quantity)
                        oldTitle.quantity = title.quantity;

                    console.log(oldTitle);
                    await oldTitle.save();
                }
            }
            res.status(200).send('Titles successfully updated');
        }
    }),
];