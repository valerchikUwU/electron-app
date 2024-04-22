const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const ProductType = require('../../models/productType');
const Product = require('../../models/product');

exports.productInit_list = asyncHandler(async (req, res, next) => {
  const productsInit = await Product.findAll({
    where: { productTypeId: 1 },
    raw: true
  });

  res.json({
    title: "ProductInitList",
    productsList: productsInit
  })
});


exports.productMain_list = asyncHandler(async (req, res, next) => {
  const productsMain = await Product.findAll({
    where: { productTypeId: 2 },
    raw: true
  });

  res.json({
    title: "ProductMainList",
    productsList: productsMain
  })
});


exports.productForEmployers_list = asyncHandler(async (req, res, next) => {
  const productsForEmployers = await Product.findAll({
    where: { productTypeId: 3 },
    raw: true
  });;

  res.json({
    title: "ProductForEmployersList",
    productsList: productsForEmployers
  })
});



exports.productDeposit_list = asyncHandler(async (req, res, next) => {
  const productsDeposit = await Product.findAll({
    where: { productTypeId: 4 },
    raw: true
  });;

  res.json({
    title: "ProductsDeposit",
    productsList: productsDeposit
  })
});




// Экспорт функции для обработки GET запроса на создание продукта.
// Эта функция асинхронно получает все типы продуктов из базы данных,
// которые могут быть использованы при добавлении нового продукта,
// и возвращает их в формате JSON.
exports.product_create_get = asyncHandler(async (req, res, next) => {
  // Используем Promise.all для параллельного выполнения запросов к базе данных.
  // В данном случае, выполняем запрос к таблице ProductType,
  // чтобы получить все типы продуктов, отсортированные по id и name.
  const [allProductTypes] = await Promise.all([
    ProductType.findAll({ order: [['id']] })
  ]);

  // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
  res.json({
    title: "Create Product",
    productTypes: allProductTypes
  });
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
      res.redirect('http://localhost:3000/api/:accountId/products/initial');
    }
  }),
];




exports.product_update_get = asyncHandler(async (req, res, next) => {
  const [product, allProductTypes] = await Promise.all([
    Product.findByPk(req.params.productId, { include: [{ model: ProductType, as: 'productType' }] }),
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
      res.redirect("http://localhost:3000/api/:accountId/products/initial");
    }
  }),
];


