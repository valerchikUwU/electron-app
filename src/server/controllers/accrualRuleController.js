const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const AccrualRule = require('../../models/accrualRule');
const Product = require('../../models/product');
const ProductType = require('../../models/productType');
const CommisionReciever = require('../../models/commisionReceiver');

exports.accrualRule_create_get = asyncHandler(async (req, res, next) => {
    const [allProducts, allProductTypes] = await Promise.all([
        Product.findAll({ order: [['name']] }),
        ProductType.findAll()
    ]);

    // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
    res.json({
        title: "Create accrualRule",
        allProducts: allProducts,
        allProductTypes: allProductTypes
    });
});


exports.accrualRule_create_post = [


    body("productTypeId")
        .escape()
        .optional({ checkFalsy: true }),
    body("productId")
        .escape()
        .optional({ checkFalsy: true }),
    body("accessType")
        .escape()
        .optional({ checkFalsy: true }),
    body("generation")
        .escape()
        .optional({ checkFalsy: true }),
    body("commision", "commision must not be empty.")
        .isInt({ min: 1 })
        .escape(),
    body().custom((value, { req }) => {
        if (!req.body.productTypeId && !req.body.productId) {
            throw new Error('At least one of productTypeId or productId must be provided.');
        }
        // Возвращаем true, если условие выполнено
        return true;
    }),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        // const formattedDate = format(new Date(), 'dd:MM:yyyy');

        const rule = new AccrualRule({
            productTypeId: req.body.productTypeId,
            productId: req.body.productId,
            accessType: req.body.accessType,
            generation: req.body.generation,
            commision: req.body.commision,
            commisionRecieverId: req.params.receiverId
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.



            res.json({
                rule: rule,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Save product.
            await rule.save();
            // res.send({ success: true });
            res.status(200).send('Created successfully').redirect(`http://localhost:3000/api/${req.params.accountId}/commisionRecievers/${req.params.receiverId}`);
        }
    }),
];



exports.accrualRule_delete_get = asyncHandler(async (req, res, next) => {
    const [rule] = await Promise.all([
        AccrualRule.findByPk(req.params.ruleId)
    ]);

    if (rule === null) {

        res.status(404).send('No rule found').redirect(`http://localhost:3000/api/${req.params.accountId}/commisionRecievers/${req.params.receiverId}`);
    }

    res.json({
        title: "Delete rule",
        rule: rule
    });
});


exports.accrualRule_delete = asyncHandler(async (req, res, next) => {
    // Assume the post has valid id (ie no validation/sanitization).

    const [rule] = await Promise.all([
        AccrualRule.findByPk(req.params.ruleId)
    ]);

    if (rule === null) {
        // No results.
        res.status(404).send('No rule found').redirect(`http://localhost:3000/api/${req.params.accountId}/commisionRecievers/${req.params.receiverId}`);
    }



    await AccrualRule.destroy({ where: { id: req.params.ruleId } });
    res.status(200).send('Deleted successfully').redirect(`http://localhost:3000/api/${req.params.accountId}/commisionRecievers/${req.params.receiverId}`);

});
