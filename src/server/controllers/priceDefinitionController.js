const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
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
        title: "prices list",
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
        title: "Create priceDefinition",
        allProducts: allProducts,
        thisProduct: thisProduct
    });
});

exports.price_create_post = [

    body("name", "name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("abbreviation", "abbreviation must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("productTypeId")
        .trim()
        .isLength({ min: 1 })
        .escape(),
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

        // const formattedDate = format(new Date(), 'dd:MM:yyyy');
        const product = new Product({
            name: req.body.name,
            abbreviation: req.body.abbreviation,
            productTypeId: req.body.productTypeId
        })


        const price = new PriceDefinition({
            priceAccess: req.body.priceAccess,
            priceBooklet: req.body.priceBooklet,
            productId: product.id,
            activationDate: new Date()
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all types for form.
            const [allProducts] = await Promise.all([
                Product.findAll({ order: [['name']] })
            ]);


            res.json({
                allProducts: allProducts,
                price: price,
                errors: errors.array(),
            });
        } else {

            await product.save();
            await price.save();
            res.redirect('http://localhost:3000/api/:accountId/prices');
        }
    }),
];



exports.price_update_get = asyncHandler(async (req, res, next) => {
    const [price] = await Promise.all([
        PriceDefinition.findByPk(req.params.priceDefId, { include: [{ model: Product, as: 'product' }] })
    ]);

    if (!price) {
        const err = new Error("priceDef not found");
        err.status = 404;
        return next(err);
    }



    res.json({
        title: "Update priceDef",
        price: price,
    });
});


exports.price_update_put = [

    body("name", "name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("abbreviation", "abbreviation must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
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



        const price = new PriceDefinition({
            priceAccess: req.body.priceAccess,
            priceBooklet: req.body.priceBooklet,
            id: req.body.priceDefId
        });

        const product = new Product({
            name: req.body.name,
            abbreviation: req.body.abbreviation
        })

        if (!errors.isEmpty()) {



            res.json({
                title: "Updated priceDef",
                price: price,
                errors: errors.array(),
            });
            return;
        } else {

            const oldPrice = await PriceDefinition.findByPk(req.params.priceDefId)
            // const formattedDate = format(new Date(), 'dd:MM:yyyy');
            oldPrice.priceAccess = price.priceAccess;
            oldPrice.priceBooklet = price.priceBooklet;
            console.log(oldPrice)
            // Данные из формы валидны. Обновляем запись.
            await oldPrice.save();

            // Перенаправляем на страницу с деталями продукта.
            res.redirect("http://localhost:3000/api/:accountId/prices");
        }
    }),
];