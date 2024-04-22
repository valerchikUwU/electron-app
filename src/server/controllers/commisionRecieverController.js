const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const CommisionReciever = require('../../models/commisionReceiver');
const AccrualRule = require('../../models/accrualRule');



exports.commisionReciever_list = asyncHandler(async (req, res, next) => {
    const allCommisionRecievers = await CommisionReciever.findAll();
    res.json({
        title: "CommisionRecievers list",
        allCommisionRecievers: allCommisionRecievers
    })
});


exports.commisionReciever_detail = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances for specific book
    const [commisionReciever, allRules] = await Promise.all([
        CommisionReciever.findByPk(req.params.receiverId),
        AccrualRule.findAll({where: {commisionRecieverId: req.params.receiverId}})
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
            res.redirect('http://localhost:3000/api/:accountId/commisionRecievers');
        }
    }),
];