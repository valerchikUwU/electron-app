const express = require("express");
const router = express.Router();
const products_controller = require("../controllers/productsController");
const accounts_controller = require("../controllers/accountsController");
const orders_controller = require("../controllers/ordersController");
const payees_controller = require("../controllers/payeeController");
const priceDefinition_controller = require("../controllers/priceDefinitionController");
const titleOrders_controller = require("../controllers/titleOrdersController");

//Товары 

/** 
 * Запрос GET для получения формы создания продукта 
 * @param productId - id продукта 
 */
router.get("/:accountId/products/newProduct", products_controller.product_create_get);

/** 
 * Запрос POST для создания нового продукта 
 * @param productId - id продукта 
 */
router.post("/:accountId/products/newProduct", products_controller.product_create_post);

/** 
 * Запрос GET для получения формы обновления продукта 
 * @param productId - id продукта 
 */
router.get("/:accountId/products/:productId/update", products_controller.product_update_get);

/** 
  * Запрос PUT для обновления продукта
  * @param productId - id продукта 
  */
router.put("/:accountId/products/:productId/update", products_controller.product_update_put);

/**
 * Запрос GET для получения всех товаров определенного типа
 * @param typeId - Тип продукта
 */
router.get("/:accountId/productsByType/:typeId", products_controller.products_list);



//Заказы

/**
 * Запрос POST для создания заказа от лица пользователя
 */
router.post("/:accountId/orders/newOrder", orders_controller.user_order_create_post);

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
 * Запрос GET для получения деталей (Всех TitleOrders) для выбранного заказа
 * @param orderId - id заказа
 */
router.get("/:accountId/orders/:orderId", orders_controller.user_order_detail);

/**
 * Запрос GET для получения деталей (Всех TitleOrders и OrganizationCustomer) для выбранного заказа от лица админа
 * @param orderId - id заказа 
 */
router.get("/:accountId/orders/admin/:orderId", orders_controller.admin_order_detail);


//Наименование

/**
 * Запрос GET для получения формы обновления TitleOrder в заказе
 * МОЖЕТ БЫТЬ НЕ ПОНАДОБИТСЯ, ТАК КАК В FIGMA НЕТ ФОРМЫ, А ИЗМЕНЕНИЯ ПРОИСХОДЯТ В USER_ORDER_DETAIL
 * @param orderId - id заказа
 * @param titleId - id наименования(TitleOrder)
 */
router.get("/:accountId/orders/:orderId/:titleId/update", titleOrders_controller.user_titleOrder_update_get);
/**
 * Запрос POST для обновления TitleOrder в заказе
 * @param orderId - id заказа
 * @param titleId - id наименования(TitleOrder)
 */
router.put("/:accountId/orders/:orderId/:titleId/update", titleOrders_controller.user_titleOrder_update_post);



//Получатели платежа 3/3

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



//Прайс листы   

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




//Аккаунты 2/2
/**
 * Запрос GET для всех пользователей
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


module.exports = router;