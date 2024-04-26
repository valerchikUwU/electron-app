const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const CommisionReciever = require('../../models/commisionReceiver');
const AccrualRule = require('../../models/accrualRule');
const { Sequelize } = require('sequelize');
const Order = require('../../models/order');



exports.commisionReciever_list = asyncHandler(async (req, res, next) => {
    const allCommisionRecievers = await CommisionReciever.findAll(
        {
            include:
                [
                    {
                        model: AccrualRule,
                        as: 'rules',
                        attributes: []
                    }
                ],
                attributes: 
                {
                    include:
                    [
                        Sequelize.literal(`COUNT (rules.id)`), 'rulesQuantity'
                    ]
                }
        }
    );
    res.json({
        title: "CommisionRecievers list",
        allCommisionRecievers: allCommisionRecievers
    })
});


exports.commisionReciever_rules_details = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances for specific book
    const [commisionReciever, allRules] = await Promise.all([
        CommisionReciever.findByPk(req.params.receiverId),
        AccrualRule.findAll({ where: { commisionRecieverId: req.params.receiverId } })
    ]);

    if (commisionReciever === null) {
        // No results.
        const err = new Error("commisionReciever not found");
        err.status = 404;
        return next(err);
    }


    res.json({
        title: commisionReciever.name,
        commisionReciever: commisionReciever,
        allRules: allRules
    });
});


exports.commisionReciever_balance_details = asyncHandler(async (req, res, next) => {
    const [commisionReceiver, orders] = await Promise.all([
        CommisionReciever.findByPk(req.params.commisionRecieverId),
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
});


exports.commisionReciever_create_get = asyncHandler(async (req, res, next) => {


    // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
    res.json({
        title: "Create commisionReciever",
    });
});


exports.commisionReciever_create_post = [


    body("commisionRecieverName", "commisionRecieverName must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),


    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        // const formattedDate = format(new Date(), 'dd:MM:yyyy');

        const commisionReciever = new CommisionReciever({
            name: req.body.commisionRecieverName,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.



            res.json({
                commisionReciever: commisionReciever,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Save product.
            await commisionReciever.save();
            // res.send({ success: true });
            res.redirect(`http://localhost:3000/api/${req.params.accountId}/commisionRecievers`);
        }
    }),
];