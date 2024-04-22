const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const OrganizationCustomer = require('../../models/organizationCustomer');

exports.organizations_list = asyncHandler(async (req, res, next) => {
    const organizations = await OrganizationCustomer.findAll({ raw: true })
    res.json({
        title: "organizations list",
        organizations: organizations
    });
}
);



exports.organization_create_get = asyncHandler(async (req, res, next) => {
    

    // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
    res.json({
        title: "Create organization",
    });
});



exports.organization_create_post = [


    body("organizationName", "organizationName must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),


    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);
        
        // const formattedDate = format(new Date(), 'dd:MM:yyyy');

        const organization = new OrganizationCustomer({
            name: req.body.organizationName,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.



            res.json({
                organization: organization,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Save product.
            await organization.save();
            // res.send({ success: true });
            res.redirect('http://localhost:3000/api/:accountId/organizations');
        }
    }),
];