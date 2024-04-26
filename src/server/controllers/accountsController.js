const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const Account = require('../../models/account');
const OrganizationCustomer = require('../../models/organizationCustomer');

exports.accounts_list = asyncHandler(async (req, res, next) => {
    const accounts = await Account.findAll({ where: { roleId: 3 }, raw: true })
    res.json({
        title: "accounts list",
        accounts: accounts
    });
}
);

exports.superAdmin_accounts_list = asyncHandler(async (req, res, next) => {
    const accounts = await Account.findAll({
        where: {
            roleId: {
                [Op.or]: [2, 3]
            }
        },
        raw: true
    });
    res.json({
        title: "accounts list",
        accounts: accounts
    });
}
);

exports.account_detail = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances for specific book
    const [account] = await Promise.all([
        Account.findByPk(req.params.accountFocusId)
    ]);

    if (account === null) {
        // No results.
        const err = new Error("Account not found");
        err.status = 404;
        return next(err);
    }

    res.json({
        title: account.telephoneNumber,
        account: account,
    });
});

exports.account_organization_create_get = asyncHandler(async (req, res, next) => {
    // Используем Promise.all для параллельного выполнения запросов к базе данных.
    // В данном случае, выполняем запрос к таблице ProductType,
    // чтобы получить все типы продуктов, отсортированные по id и name.
    const [allOrganizations] = await Promise.all([
        OrganizationCustomer.findAll({ order: [['name']] })
    ]);

    // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
    res.json({
        title: "Create Account",
        organizations: allOrganizations
    });
});



exports.account_organization_create_post = [

    (req, res, next) => {
        if (!Array.isArray(req.body.organizationList)) {
            req.body.organizationList =
                typeof req.body.organizationList === "undefined" ? [] : [req.body.organizationList];
        }
        next();
    },

    body("firstName", "First name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("lastName", "LastName must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("telephoneNumber", "TelephoneNumber must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("organizationList.*").escape(),




    asyncHandler(async (req, res, next) => {



        const errors = validationResult(req);

        // const formattedDate = format(new Date(), 'dd:MM:yyyy');
        for (const organization of req.body.organizationList) {
            if (await OrganizationCustomer.findOne({ where: { organizationName: organization }}) === null) {
                const org = await OrganizationCustomer.create(
                    {
                        organizationName: organization
                    }
                )
                org.save();
            }

        }


        const account = new Account({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            telephoneNumber: req.body.telephoneNumber,
            telegramId: req.body.telegramId,
            organizationList: req.body.organizationList,
            roleId: 3
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all types for form.
            const [allOrganizations] = await Promise.all([
                OrganizationCustomer.findAll({ order: [['name']] })
            ]);


            res.json({
                organizations: allOrganizations,
                account: account,
                errors: errors.array(),
            });
        } else {
            // Data from form is valid. Save product.
            await account.save();
            // res.send({ success: true });
            res.redirect(`http://localhost:3000/api/${req.params.accountId}/accounts`);
        }
    }),
];



// ТУТ ДОДЕЛАТЬ
exports.account_update_get = asyncHandler(async (req, res, next) => {
    const [account, allOrganizations] = await Promise.all([
        Account.findByPk(req.params.accountFocusId,
            {
                include:
                    [
                        {
                            model: OrganizationCustomer,
                            as: 'organizations'
                        }
                    ]
            }),
        OrganizationCustomer.findAll()
    ]);

    if (!account) {
        const err = new Error("Account not found");
        err.status = 404;
        return next(err);
    }



    res.json({
        title: "Update account",
        organizations: allOrganizations,
        account: account,
    });
});


exports.account_update_put = [


    // Validate and sanitize fields.
    body("firstName", "First name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("lastName", "LastName must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("telephoneNumber", "TelephoneNumber must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("telegramId")
        .optional({ checkFalsy: true }) // Поле является необязательным
        .trim() // Удаляем пробелы в начале и конце строки
        .isLength({ min: 1 }) // Проверяем, что длина строки больше 0, если поле предоставлено
        .escape(), // Экранируем специальные символы
    body("organizationList.*").escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        // const formattedDate = format(new Date(), 'dd:MM:yyyy');
        const account = new Account({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            telephoneNumber: req.body.telephoneNumber,
            telegramId: req.body.telegramId,
            organizationList: req.body.organizationList,
            _id: req.params.accountFocusId
        });

        if (!errors.isEmpty()) {
            const [allOrganizations] = await Promise.all([
                OrganizationCustomer.findAll()
            ]);


            res.json({
                title: "Update Account",
                organizations: allOrganizations,
                account: account,
                errors: errors.array(),
            });
            return;
        } else {
            // Данные из формы валидны. Обновляем запись.
            const oldAccount = await Account.findByPk(req.params.accountFocusId)
            oldAccount.firstName = account.firstName;
            oldAccount.lastName = account.lastName;
            oldAccount.telephoneNumber = account.telephoneNumber;
            oldAccount.telegramId = account.telegramId;
            oldAccount.organizationList = account.organizationList;

            await oldAccount.save();

            res.redirect("http://localhost:3000/api/:accountdId/accounts");
        }
    }),
];
