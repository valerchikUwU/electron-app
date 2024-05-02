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

    res.json({
        title: "Создание правила пополнения",
        allProducts: allProducts,
        allProductTypes: allProductTypes
    });
});


exports.accrualRule_create_post = [


    body("productTypeId")
        .if(body("productTypeId").exists())
        .isNumeric()
        .withMessage('Тип продукта должен быть числом')
        .isIn([1, 2, 3])
        .withMessage('Тип продукта может быть только 1, 2 или 3'),
    body("productId")
        .if(body("productId").exists())
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("accessType")
        .optional({ checkFalsy: true })
        .escape(),
    body("generation")
        .optional({ checkFalsy: true })
        .escape(),
    body("commision", "Размер комиссии должен быть указан!")
        .isInt({ min: 1 })
        .escape(),
    body().custom((value, { req }) => {
        if (!req.body.productTypeId && !req.body.productId) {
            throw new Error('Должен быть указан тип продукта или сам продукт!');
        }
        return true;
    }),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);


        const rule = new AccrualRule({
            productTypeId: req.body.productTypeId,
            productId: req.body.productId,
            accessType: req.body.accessType,
            generation: req.body.generation,
            commision: req.body.commision,
            commisionRecieverId: req.params.receiverId
        });

        if (!errors.isEmpty()) {

            res.json({
                rule: rule,
                errors: errors.array(),
            });
        } 
        else {
            await rule.save();
            res.status(200).send('Правило начисления комиссии успешно создано!');
        }
    }),
];



exports.accrualRule_delete_get = asyncHandler(async (req, res, next) => {
    const [rule] = await Promise.all([
        AccrualRule.findByPk(req.params.ruleId)
    ]);

    if (rule === null) {

        res.status(404).send('Такое правило не найдено!');
    }

    res.json({
        title: "Удаление правила",
        rule: rule
    });
});


exports.accrualRule_delete = asyncHandler(async (req, res, next) => {
    

    const [rule] = await Promise.all([
        AccrualRule.findByPk(req.params.ruleId)
    ]);

    if (rule === null) {
        res.status(404).send('Такое правило не найдено!');
    }



    await AccrualRule.destroy({ where: { id: req.params.ruleId } });
    res.status(200).send('Правило начисления комиссии успешно создано!');

});
