const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const Order = require('../../models/order');
const TitleOrders = require('../../models/titleOrders');





exports.user_titleOrder_update_put = [


    // Validate and sanitize fields.
    body("productId", "productId must be chosen")
        .trim()
        .isLength({ min: 1 })
        .escape(),
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
    body("addBooklet")
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const titlesToUpdate = TitleOrders.findAll(
            {
                where:
                {
                    orderId: req.params.orderId
                }
            }
        )

        if (!errors.isEmpty()) {
            const [order, titleOrders] = await Promise.all([
                Order.findByPk(req.params.orderId),
                TitleOrders.findAll({ where: { orderId: req.params.orderId } })
            ]);
            

            res.json({
                title: "Update order",
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
                    if (req.body.productId) oldTitle.productId = req.body.productId;
                    if (req.body.accessType) oldTitle.accessType = req.body.accessType;
                    if (req.body.generation) oldTitle.generation = req.body.generation;
                    if (req.body.quantity) oldTitle.quantity = req.body.quantity;
                    if (req.body.addBooklet !== undefined) oldTitle.addBooklet = req.body.addBooklet;

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