const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const ProductType = require('../../models/productType');
const Product = require('../../models/product');

exports.products_list = asyncHandler(async (req, res, next) => {
  const productTypeId = parseInt(req.params.typeId, 10);

  if (isNaN(productTypeId)) {
    return res.status(400).json({ error: 'Invalid product type ID' });
  }

  switch (productTypeId) {
    case 1:
      const productsInit = await Product.findAll({
        where: { productTypeId: productTypeId },
        raw: true
      });

      res.json({
        title: "ProductInitList",
        productsList: productsInit
      });
      break;
    case 2:
      const productsMain = await Product.findAll({
        where: { productTypeId: productTypeId },
        raw: true
      });

      res.json({
        title: "ProductMainList",
        productsList: productsMain
      });
      break;
    case 3:
      const productsForEmployers = await Product.findAll({
        where: { productTypeId: productTypeId },
        raw: true
      });;

      res.json({
        title: "ProductForEmployersList",
        productsList: productsForEmployers
      });
      break;
    case 4:
      const productsDeposit = await Product.findAll({
        where: { productTypeId: productTypeId },
        raw: true
      });;

      res.json({
        title: "ProductsDeposit",
        productsList: productsDeposit
      });
      break;

  }

});








exports.product_update_get = asyncHandler(async (req, res, next) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  const [product, allProductTypes] = await Promise.all([
    Product.findByPk(productId, {
      include:
        [
          {
            model: ProductType, as: 'productType'
          }
        ]
    }),
    ProductType.findAll()
  ]);

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }



  res.json({
    title: "Update product",
    productTypes: allProductTypes,
    product: product,
  });
});


exports.product_update_put = [


  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("abbreviation", "Abbreviation must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    
    const product = new Product({
      name: req.body.name,
      abbreviation: req.body.abbreviation,
      _id: req.params.productId,
    })

    if (!errors.isEmpty()) {
      const [allProductTypes] = await Promise.all([
        ProductType.findAll()
      ]);


      res.json({
        title: "Updated Product",
        productTypes: allProductTypes,
        product: product,
        errors: errors.array(),
      });
      return;
    } else {

      const oldProduct = await Product.findByPk(req.params.productId)
      // const formattedDate = format(new Date(), 'dd:MM:yyyy');
      oldProduct.name = product.name;
      oldProduct.abbreviation = product.abbreviation;
      console.log(oldProduct)
      // Данные из формы валидны. Обновляем запись.
      await oldProduct.save();

      // Перенаправляем на страницу с деталями продукта.
      res.redirect("http://localhost:3000/api/:accountId/productsByType/1");
    }
  }),
];


