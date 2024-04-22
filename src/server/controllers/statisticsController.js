const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");


exports.sells_list = asyncHandler(async (req, res, next) => {
    const organizations = await OrganizationCustomer.findAll({ raw: true })
    res.json({
        title: "organizations list",
        organizations: organizations
    });
});
