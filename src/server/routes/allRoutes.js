const express = require("express");
const router = express.Router();
const products_controller = require("../controllers/productsController");
const accounts_controller = require("../controllers/accountsController");
const orders_controller = require("../controllers/ordersController");
const payees_controller = require("../controllers/payeeController");
const priceDefinition_controller = require("../controllers/priceDefinitionController");
const titleOrders_controller = require("../controllers/titleOrdersController");

//Товары 8/8
router.get("/:accountId/products/initial", products_controller.productInit_list);    //++++++
router.get("/:accountId/products/main", products_controller.productMain_list);                          //++++++
router.get("/:accountId/products/forEmployers", products_controller.productForEmployers_list); //++++++
router.get("/:accountId/products/deposit", products_controller.productDeposit_list); //++++++
router.get("/:accountId/products/newProduct", products_controller.product_create_get); //++++++
router.post("/:accountId/products/newProduct", products_controller.product_create_post); //++++++
router.get("/:accountId/products/:productId/update", products_controller.product_update_get);  //++++++
router.put("/:accountId/products/:productId/update", products_controller.product_update_put);   //++++++





//Заказы
router.get("/:accountId/orders", orders_controller.user_active_orders_list);
router.get("/:accountId/orders/finished", orders_controller.user_finished_orders_list);
router.get("/:accountId/orders/all", orders_controller.admin_orders_list);
router.get("/:accountId/orders/:orderId", orders_controller.user_order_detail);
router.get("/:accountId/orders/admin/:orderId", orders_controller.admin_order_detail);


//Наименование
router.get("/:accountId/orders/:orderId/:titleId/update", titleOrders_controller.user_titleOrder_update_get);
router.put("/:accountId/orders/:orderId/:titleId/update", titleOrders_controller.user_titleOrder_update_post);



//Получатели платежа 3/3
router.get("/:accountId/payees", payees_controller.payee_list);      //++++++
router.get("/:accountId/payees/newPayee", payees_controller.payee_create_get);     //++++++
router.post("/:accountId/payees/newPayee", payees_controller.payee_create_post);   //++++++



//Прайс листы  5/5 
router.get("/:accountId/prices", priceDefinition_controller.prices_list);    //++++++
router.get("/:accountId/prices/newPrice", priceDefinition_controller.price_create_get);   //++++++
router.post("/:accountId/prices/newPrice", priceDefinition_controller.price_create_post);   //++++++
router.get("/:accountId/prices/:priceDefId/update", priceDefinition_controller.price_update_get);   //++++++
router.put("/:accountId/prices/:priceDefId/update", priceDefinition_controller.price_update_put);   //++++++




//Аккаунты 2/2
router.get("/:accountId/accounts", accounts_controller.accounts_list);             //++++++
router.post("/:accountId/account_create", accounts_controller.account_create_post);   //++++++


module.exports = router;