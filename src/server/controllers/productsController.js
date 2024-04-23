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





exports.product_create_get = asyncHandler(async (req, res, next) => {
  try {
     // Используем await для ожидания результата запроса к базе данных.
     const allProductTypes = await ProductType.findAll({
       order: [['id', 'ASC']] // Сортировка по id и name
     });
 
     // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
     res.json({
       title: "Create Product",
       productTypes: allProductTypes
     });
  } catch (error) {
     // Обработка ошибок
     console.error(error);
     res.status(500).json({ error: 'An error occurred while fetching product types' });
  }
 });



exports.product_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.productTypes)) {
      req.body.productTypes =
        typeof req.body.productTypes === "undefined" ? [] : [req.body.productTypes];
    }
    next();
  },


  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("abbreviation", "Abbreviation must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("productTypeId").escape(),


  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);

    // const formattedDate = format(new Date(), 'dd:MM:yyyy');
    const product = new Product({
      name: req.body.name,
      abbreviation: req.body.abbreviation,
      productTypeId: req.body.productTypeId
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all types for form.
      const [allProductTypes] = await Promise.all([
        ProductType.findAll({ order: [['id', 'name']] })
      ]);


      res.json({
        productTypes: allProductTypes,
        product: product,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save product.
      await product.save();
      res.redirect(`http://localhost:3000/api/:accountId/productsByType/${req.body.productTypeId}`);
    }
  }),
];




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
  body("productTypeId", "ProductType must not be empty.")
    .escape()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const product = new Product({
      name: req.body.name,
      abbreviation: req.body.abbreviation,
      productTypeId: req.body.productTypeId,
      _id: req.params.productId,
    })
    console.log(product)

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
      oldProduct.productTypeId = product.productTypeId;
      console.log(oldProduct)
      // Данные из формы валидны. Обновляем запись.
      await oldProduct.save();

      // Перенаправляем на страницу с деталями продукта.
      res.redirect("http://localhost:3000/api/:accountId/productsByType/1");
    }
  }),
];


