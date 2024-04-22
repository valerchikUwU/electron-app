const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const Payee = require('../../models/payee');


exports.payee_list = asyncHandler(async (req, res, next) => {
    const allPayees = await Payee.findAll();
    res.json({
        title: "payee list",
        payees_list: allPayees
    })
});

exports.payee_create_get = asyncHandler(async (req, res, next) => {
  
    // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
    res.json({
      title: "Create Payee"
    });
  });


  
exports.payee_create_post = [
    
  
  
    body("name", "Name must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
  
  
    asyncHandler(async (req, res, next) => {
  
      const errors = validationResult(req);
  
  
      const payee = new Payee({
        name: req.body.name
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
  
  
        res.json({
          payee: payee,
          errors: errors.array(),
        });
      } else {
        // Data from form is valid. Save product.
        await payee.save();
        res.redirect('http://localhost:3000/api/:accountId/payees');
      }
    }),
  ];