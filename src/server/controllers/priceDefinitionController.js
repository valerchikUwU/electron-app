const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const PriceDefinition = require('../../models/priceDefinition');
const Product = require('../../models/product');
const ProductType = require('../../models/productType');

exports.prices_list = asyncHandler(async (req, res, next) => {
    const pricesInit = await PriceDefinition.findAll({
        include: [{
            model: Product,
            where: { productTypeId: 1 }

        }]
    });
    const pricesMain = await PriceDefinition.findAll({
        include: [{
            model: Product,
            where: { productTypeId: 2 }
        }]
    });
    const pricesForEmployers = await PriceDefinition.findAll({
        include: [{
            model: Product,
            where: { productTypeId: 3 }
        }]
    });
    res.json({
        title: "Список прайс листов",
        pricesInit: pricesInit,
        pricesMain: pricesMain,
        pricesForEmployers: pricesForEmployers,
    });
}
);

exports.price_create_get = asyncHandler(async (req, res, next) => {
    const priceDef = PriceDefinition.findByPk(req.params.priceDefId)
    const [allProducts, thisProduct] = await Promise.all([
        Product.findAll({ order: [['name']] }),
        Product.findOne({ where: { id: priceDef.productId } })
    ]);

    // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
    res.json({
        title: "Форма создания прайс листа",
        allProducts: allProducts,
        thisProduct: thisProduct
    });
});

exports.price_create_post = [

    body("name", "Название должно быть указано")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("abbreviation", "Аббревиаутра должна быть указана")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("priceAccess", "Цена доступа должна быть указана")
        .isInt({ min: 1 })
        .escape(),
    body("priceBooklet", "Цена буклета должна быть указана")
        .isInt({ min: 1 })
        .escape(),


    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        const product = new Product({
            name: req.body.name,
            abbreviation: req.body.abbreviation,
        })


        const price = new PriceDefinition({
            priceAccess: req.body.priceAccess,
            priceBooklet: req.body.priceBooklet,
            productId: product.id,
            activationDate: new Date()
        });

        if (!errors.isEmpty()) {
            const [allProducts] = await Promise.all([
                Product.findAll({ order: [['name']] })
            ]);


            res.json({
                title: "Некорректная форма создания прайс листа!",
                allProducts: allProducts,
                price: price,
                errors: errors.array(),
            });
        } 
        else {

            await product.save();
            await price.save();
            res.status(200).send("Прайс лист успешно создан!");
        }
    }),
];



exports.price_update_get = asyncHandler(async (req, res, next) => {
    const [price] = await Promise.all([
        PriceDefinition.findByPk(req.params.priceDefId, { include: [{ model: Product, as: 'product' }] })
    ]);

    if (!price) {
        const err = new Error("Такой прайс лист не найден!");
        err.status = 404;
        return next(err);
    }



    res.json({
        title: "Форма обновления прайс - листа",
        price: price,
    });
});


exports.price_update_put = [

    
    body("priceAccess", "priceAccess must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("priceBooklet", "priceBooklet must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);


        const oldPrice = await PriceDefinition.findByPk(req.params.priceDefId);

        const price = new PriceDefinition({
            priceAccess: req.body.priceAccess,
            priceBooklet: req.body.priceBooklet,
            _id: req.body.priceDefId
        });


        if (!errors.isEmpty()) {



            res.json({
                title: "Некорректная форма обновления прайс листа",
                price: price,
                errors: errors.array(),
            });
            return;
        } else {

            oldPrice.priceAccess = price.priceAccess;
            oldPrice.priceBooklet = price.priceBooklet;

            await oldPrice.save();

            // Перенаправляем на страницу с деталями продукта.
            res.status(200).send("Прайс лист успешно обновлен!");
        }
    }),
];