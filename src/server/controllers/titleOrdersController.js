const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');





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
                    
                    if (title.productId) oldTitle.productId = title.productId;
                    if (title.accessType) oldTitle.accessType = title.accessType;
                    if (title.generation) oldTitle.generation = title.generation;
                    if (title.quantity) oldTitle.quantity = title.quantity;
                    if (title.addBooklet !== undefined) oldTitle.addBooklet = title.addBooklet;
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

    await TitleOrders.destroy(req.params.titleId);
    res.status(200).send('Title destroyed');

});