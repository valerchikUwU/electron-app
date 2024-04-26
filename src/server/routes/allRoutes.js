const express = require("express");
const router = express.Router();
const products_controller = require("../controllers/productsController");
const accounts_controller = require("../controllers/accountsController");
const orders_controller = require("../controllers/ordersController");
const payees_controller = require("../controllers/payeeController");
const priceDefinition_controller = require("../controllers/priceDefinitionController");
const titleOrders_controller = require("../controllers/titleOrdersController");
const organizationCustomer_controller = require("../controllers/organizationCustomerController")
const deposit_controller = require("../controllers/depositController")

/*
============================================================
ЗАПРОСЫ ДЛЯ ТОВАРОВ
============================================================
*/

/**
 * Запрос GET для получения всех товаров определенного типа
 * @param typeId - Тип продукта
 */
router.get("/:accountId/productsByType/:typeId", products_controller.products_list);






/*
============================================================
ЗАПРОСЫ ДЛЯ ЗАКАЗОВ
============================================================
*/




/**
 * Запрос POST для создания заказа от лица пользователя
 */
router.post("/:accountId/orders/newOrder", orders_controller.user_order_create_post);

/**
 * Запрос PUT для обновления черновика заказа от лица пользователя (НА СТРАНИЦЕ "В РАБОТЕ")
 */
router.put("/:accountId/orders/:orderId/update", orders_controller.user_draftOrder_update_put)


/**
 * Запрос GET для получения всех активных заказов пользователя
 */
router.get("/:accountId/orders", orders_controller.user_active_orders_list);


/**
 * Запрос GET для получения всех завершенных заказов пользователя
 */
router.get("/:accountId/orders/finished", orders_controller.user_finished_orders_list);


/**
 * Запрос GET для получения всех заказов от лица админа
 */
router.get("/:accountId/orders/all", orders_controller.admin_orders_list);

/**
 * Запрос GET для получения всех архивных заказов от лица админа
 */
router.get("/:accountId/orders/archive", orders_controller.admin_archivedOrders_list);


/**
 * Запрос PUT для обновления черновика заказа от лица админа
 */
router.put("/:accountId/orders/admin/:orderId/update", orders_controller.admin_order_update_put)

/**
 * Запрос GET для получения деталей (Всех TitleOrders и OrganizationCustomer) для выбранного заказа от лица админа
 * @param orderId - id заказа 
 */
router.get("/:accountId/orders/admin/:orderId", orders_controller.admin_order_detail);


/**
 * Запрос GET для получения деталей (Всех TitleOrders) для выбранного заказа
 * @param orderId - id заказа
 */
router.get("/:accountId/orders/:orderId", orders_controller.user_order_detail);





/*
============================================================
ЗАПРОСЫ ДЛЯ НАИМЕНОВАНИЙ(TitleOrder)
============================================================
*/

/**
 * Запрос DELETE для удаления ОДНОГО! TitleOrder в заказе
 * @param orderId - id заказа
 * @param titleId - id наименования
 */
router.delete("/:accountId/orders/:orderId/delete/:titleId", titleOrders_controller.title_delete)


/**
 * Запрос PUT для обновления ВСЕХ! TitleOrder в заказе от лица пользователя
 * @param orderId - id заказа
 */
router.put("/:accountId/orders/:orderId/update", titleOrders_controller.user_titleOrder_update_put);



/**
 * Запрос PUT для обновления ВСЕХ! TitleOrder в заказе от лица админа
 * @param orderId - id заказа
 */
router.put("/:accountId/orders/admin/update/:orderId", titleOrders_controller.admin_titleOrder_update_put);






/*
============================================================
ЗАПРОСЫ ДЛЯ Получателей платежа(Payee)
============================================================
*/

/**
 * Запрос GET для получения всех получателей платежей (Payee)
 */
router.get("/:accountId/payees", payees_controller.payee_list);

/**
 * Запрос GET для получения формы для создания нового получателя платежа (Payee)
 */
router.get("/:accountId/payees/newPayee", payees_controller.payee_create_get);
/**
 * Запрос POST для создания нового получателя платежа (Payee)
 */
router.post("/:accountId/payees/newPayee", payees_controller.payee_create_post);   //++++++



/*
============================================================
ЗАПРОСЫ ДЛЯ ПРАЙС ЛИСТОВ(PriceDefinition)
============================================================
*/

/**
 * Запрос GET для получения всех прайс листов(PriceDefinition)
 */
router.get("/:accountId/prices", priceDefinition_controller.prices_list);
/**
 * Запрос GET для получения формы для создания нового прайс листа (PriceDefinition)
 */
router.get("/:accountId/prices/newPrice", priceDefinition_controller.price_create_get);
/**
 * Запрос POST для создания нового прайс листа (PriceDefinition)
 */
router.post("/:accountId/prices/newPrice", priceDefinition_controller.price_create_post);
/**
 * Запрос GET для получения формы обновления прайс листа (PriceDefinition)
 * @param priceDefId - id прайс листа
 */
router.get("/:accountId/prices/:priceDefId/update", priceDefinition_controller.price_update_get);
/**
 * Запрос POST для обновления прайс листа (PriceDefinition)
 * @param priceDefId - id прайс листа
 */
router.put("/:accountId/prices/:priceDefId/update", priceDefinition_controller.price_update_put);  




/*
============================================================
ЗАПРОСЫ ДЛЯ АККАУНТОВ
============================================================
*/


/**
 * Запрос GET для получения формы обновления аккаунта
 * @param accountFocusId - id выбранного пользователя
 */
router.get("/:accountId/accounts/:accountFocusId/update", accounts_controller.account_update_get); 

/**
 * Запрос PUT для выбранного аккаунта
 * @param accountFocusId - id выбранного пользователя
 */
router.put("/:accountId/accounts/:accountFocusId/update", accounts_controller.account_update_put); 

/**
 * Запрос GET для всех пользователей от лица суперАдмина
 */
router.get("/:accountId/superAdmin/accounts", accounts_controller.superAdmin_accounts_list); 


/**
 * Запрос GET для всех пользователей от лица админа
 */
router.get("/:accountId/accounts", accounts_controller.accounts_list); 


/**
 * Запрос GET для получения формы создания нового аккаунта
 */
router.get("/:accountId/newAccount", accounts_controller.account_create_get);


/**
 * Запрос POST для создания нового аккаунта
 */
router.post("/:accountId/newAccount", accounts_controller.account_create_post);



/*
============================================================
ЗАПРОСЫ ДЛЯ ОРГАНИЗАЦИЙ ПОКУПАТЕЛЕЙ(АКАДЕМИЯ)(OrganizationCustomer)
============================================================
*/

/**
 * Запрос GET для получения всех организаций(академий)
 */
router.get("/:accountId/organizationsCustomer", organizationCustomer_controller.organizations_list);


/**
 * Запрос GET для получения формы создания организации(академии)
 */
router.get("/:accountId/organizationsCustomer/newOrganizationCustomer", organizationCustomer_controller.organization_create_get);


/**
 * Запрос POST для создания новой организации(академии)
 */
router.post("/:accountId/organizationsCustomer/newOrganizationCustomer",  organizationCustomer_controller.organization_create_post);



/*
============================================================
ЗАПРОСЫ ДЛЯ ДЕПОЗИТОВ
============================================================
*/


/**
 * Запрос GET для получения формы создания депозита
 * @param organizationCustomerId - id организации
 */
router.get("/:acountId/deposits/:organizationCustomerId/newDeposit", deposit_controller.deposit_create_get);

/**
 * Запрос POST для добавления депозита
 * @param organizationCustomerId - id организации
 */
router.post("/:acountId/deposits/:organizationCustomerId/newDeposit", deposit_controller.deposit_create_post);


/**
 * Запрос GET для получения деталей депозитов для конкретной организации
 * @param organizationCustomerId - id организации
 */
router.get("/:acountId/deposits/:organizationCustomerId", deposit_controller.deposits_details);


/**
 * Запрос GET для получения всех остатков на депозитах
 */
router.get("/:accountId/deposits", deposit_controller.deposits_list);



module.exports = router;