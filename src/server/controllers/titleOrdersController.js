const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');


exports.user_titleOrder_update_get = asyncHandler(async (req, res, next) => {
    const [order, titleOrders] = await Promise.all([
        Order.findByPk(req.params.orderId),
        TitleOrders.findAll({ where: { orderId: req.params.orderId } })
    ]);

    if (!order) {
        const err = new Error("order not found");
        err.status = 404;
        return next(err);
    }

    if (order.status != "Черновик") {
        const err = new Error("order status not draft!");
        err.status = 404;
        return next(err);
    }



    res.json({
        title: "Update draft order",
        order: order,
        titleOrders: titleOrders
    });
});


exports.user_titleOrder_update_post = [


    // Validate and sanitize fields.
    body("accessType", "accessType must be choses")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("generation", "generation must be chosen")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("quantity", "quantity must be written")
        .trim()
        .isLength({ min: 1 })
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const title = new TitleOrders({
            accessType: req.body.accessType,
            generation: req.body.generation,
            quantity: req.body.quantity,
            addBooklet: req.body.addBooklet,
            _id: req.body.titleId
        });

        if (!errors.isEmpty()) {
            const [order, titleOrders] = await Promise.all(
                Order.findByPk(req.params.orderId),
                TitleOrders.findAll({ where: { orderId: req.params.orderId } }));


            res.json({
                title: "Update order",
                titleOrders: titleOrders,
                order: order,
                errors: errors.array(),
            });
            return;
        } else {
            const oldTitle = await TitleOrders.findByPk(req.params.titleId);
            oldTitle.accessType = title.accessType;
            oldTitle.generation = title.generation;
            oldTitle.quantity = title.quantity;
            oldTitle.addBooklet = title.addBooklet;
            await oldTitle.save();
            res.redirect('http://localhost:3000/api/:accountId/orders/:orderId');
        }
    }),
];
