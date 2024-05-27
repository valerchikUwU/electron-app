const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const { Sequelize, Op, fn, col } = require('sequelize');
const Account = require('../../models/account');
const OrganizationCustomer = require('../../models/organizationCustomer');
const Role = require('../../models/role');
const dateFns = require('date-fns');

exports.accounts_list = asyncHandler(async (req, res, next) => {
    const accounts = await Account.findAll({ where: { roleId: 3 }, raw: true })
    accounts.forEach(account => {
        account.formattedLastSeen = account.lastSeen ? dateFns.format(account.lastSeen, 'HH:mm dd-MM') : null;
    });
    res.json({
        title: "Список аккаунтов",
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
    accounts.forEach(account => {
        account.formattedLastSeen = account.lastSeen ? dateFns.format(account.lastSeen, 'HH:mm dd-MM') : null;
    });
    res.json({
        title: "Список аккаунтов",
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
        const err = new Error("Такой аккаунт не найден");
        err.status = 404;
        return next(err);
    }

    res.json({
        title: `Детали аккаунта с номером телефона: ${account.telephoneNumber}`,
        account: account,
    });
});

exports.account_organization_create_get = asyncHandler(async (req, res, next) => {
    // Используем Promise.all для параллельного выполнения запросов к базе данных.
    // В данном случае, выполняем запрос к таблице ProductType,
    // чтобы получить все типы продуктов, отсортированные по id и name.
    const allOrganizations = await OrganizationCustomer.findAll({ order: ['organizationName'] })


    // Отправляем ответ клиенту в формате JSON, содержащий заголовок и массив типов продуктов.
    res.json({
        title: "Форма создания аккаунта для админа",
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

    body("firstName", "Имя должно быть указано!")
        .trim()
        .isLength({ min: 1 })
        .escape(),
        // .matches(/^[а-яА-ЯёЁ\s]+$/, 'ru-RU')
        // .withMessage('Имя может содержать только русские буквы и пробелы'),
    body("lastName", "Фамилия должна быть указана!")
        .trim()
        .isLength({ min: 1 })
        .escape(),
        // .matches(/^[а-яА-ЯёЁ\s]+$/, 'ru-RU')
        // .withMessage('Фамилия может содержать только русские буквы и пробелы'),
    body("telephoneNumber", "Номер телефона должен быть указан!")
        .trim()
        .isLength({ min: 10 })
        .escape(),
        // .matches(/^\+7\d{10}$/, 'ru-RU')
        // .withMessage('Номер телефона должен начинаться с +7 и содержать 10 цифр'),
    body("organizationList.*").escape(),




    asyncHandler(async (req, res, next) => {



        const errors = validationResult(req);

        for (const organization of req.body.organizationList) {
            if (await OrganizationCustomer.findOne({ where: { organizationName: organization } }) === null) {
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
            organizationList: req.body.organizationList,
            roleId: 3
        });

        if (!errors.isEmpty()) {
            const [allOrganizations] = await Promise.all([
                OrganizationCustomer.findAll({ order: [['name']] })
            ]);


            res.json({
                organizations: allOrganizations,
                account: account,
                errors: errors.array(),
            });
        } else {
            await account.save();
            res.status(200).send('Аккаунт успешно создан!');
        }
    }),
];




exports.superAdmin_account_organization_create_get = asyncHandler(async (req, res, next) => {
    const [allOrganizations, allRoles] = await Promise.all([
        OrganizationCustomer.findAll({ order: [['name']] }),
        Role.findAll({
            where: {
                id: {
                    [Op.ne]: 1
                }
            }
        })
    ]);
    res.json({
        title: "Форма создания аккаунта для суперАдмина",
        organizations: allOrganizations,
        allRoles: allRoles
    });
});


exports.superAdmin_account_organization_create_post = [

    (req, res, next) => {
        if (!Array.isArray(req.body.organizationList)) {
            req.body.organizationList =
                typeof req.body.organizationList === "undefined" ? [] : [req.body.organizationList];
        }
        next();
    },

    body("firstName", "Имя должно быть указано!")
        .trim()
        .isLength({ min: 1 })
        .escape(),
        // .matches(/^[а-яА-ЯёЁ\s]+$/, 'ru-RU') // Исправлено: 'ru-RU' не используется как флаг
        // .withMessage('Имя может содержать только русские буквы и пробелы'),
    body("lastName", "Фамилия должна быть указана!")
        .trim()
        .isLength({ min: 1 })
        .escape(),
        // .matches(/^[а-яА-ЯёЁ\s]+$/, 'ru-RU') // Исправлено: 'ru-RU' не используется как флаг
        // .withMessage('Фамилия может содержать только русские буквы и пробелы'),
    body("telephoneNumber", "Номер телефона должен быть указан!")
        .trim()
        .isLength({ min: 10 })
        .escape(),
        // .matches(/^\+7\d{10}$/, 'ru-RU') // Исправлено: 'ru-RU' не используется как флаг
        // .withMessage('Номер телефона должен начинаться с +7 и содержать 10 цифр'),
    body("roleId", "Роль должна быть выбрана!")
        .isIn([2, 3])
        .isLength({ min: 1 })
        .escape(),
    body("organizationList.*").escape(),




    asyncHandler(async (req, res, next) => {



        const errors = validationResult(req);

        for (const organization of req.body.organizationList) {
            if (await OrganizationCustomer.findOne({ where: { organizationName: organization } }) === null) {
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
            organizationList: req.body.organizationList,
            roleId: req.body.roleId
        });

        if (!errors.isEmpty()) {
            const [allOrganizations, allRoles] = await Promise.all([
                OrganizationCustomer.findAll({ order: [['name']] }),
                Role.findAll({
                    where: {
                        id: {
                            [Op.ne]: 1
                        }
                    }
                })
            ]);


            res.json({
                organizations: allOrganizations,
                allRoles: allRoles,
                account: account,
                errors: errors.array(),
            });
        } else {
            await account.save();
            res.status(200).send('Аккаунт успешно создан!');
        }
    }),
];




exports.account_update_get = asyncHandler(async (req, res, next) => {
    const [account, allOrganizations] = await Promise.all([
        Account.findByPk(req.params.accountFocusId),
        getOrganizationList(req.params.accountFocusId)
    ]);

    if (!account) {
        const err = new Error("Аккаунт не найден!");
        err.status = 404;
        return next(err);
    }



    res.json({
        title: "Форма обновления аккаунта для админа",
        organizations: allOrganizations,
        account: account,
    });
});


exports.account_update_put = [


    body("firstName")
        .if(body("firstName").exists())
        .trim()
        .isLength({ min: 1 })
        .escape()
        .matches(/^[а-яА-ЯёЁ\s]+$/, 'ru-RU')
        .withMessage('Имя может содержать только русские буквы и пробелы'),
    body("lastName")
        .if(body("lastName").exists())
        .trim()
        .isLength({ min: 1 })
        .escape()
        .matches(/^[а-яА-ЯёЁ\s]+$/, 'ru-RU')
        .withMessage('Фамилия может содержать только русские буквы и пробелы'),
    body("telephoneNumber")
        .if(body("telephoneNumber").exists())
        .trim()
        .isLength({ min: 10 })
        .escape()
        .matches(/^\+7\d{10}$/, 'ru-RU')
        .withMessage('Номер телефона должен начинаться с +7 и содержать 10 цифр'),
    body("organizationList.*").escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
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
                title: "Форма ввода некорректна, повторите попытку!",
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

            res.status(200).send('Аккаунт успешно обновлен!');
        }
    }),
];




async function getOrganizationList(accountId) {
    try {
        const account = await Account.findByPk(accountId);
        if (!account) {
            throw new Error('Account not found');
        }
        return account.organizationList;
    } catch (error) {
        console.error(error);
    }
}
