const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const OrganizationCustomer = require('../../models/organizationCustomer');


exports.organizations_list = asyncHandler(async (req, res, next) => {
    const organizations = await OrganizationCustomer.findAll({ raw: true })
    res.json({
        title: "organizations list",
        organizations: organizations
    });
});
