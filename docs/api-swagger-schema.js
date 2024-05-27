/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *          example: 8800e557-6247-4f12-a9d8-534d59c09318
 *        name:
 *          type: string
 *          example: product
 *        abbreviation:
 *          type: string
 *          example: KPSS
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: 2024-05-01 17:25:00
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          example: 2024-05-01 17:25:00
 *        productTypeId:
 *          type: integer
 *          example: 1
 *    Order:
 *      type: object
 *      properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *                  readOnly: true
 *                  description: Уникальный идентификатор заказа
 *                  example: 8800e557-6247-4f12-a9d8-534d59c09318
 *              dispatchDate:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *                  description: Дата и время отправки заказа
 *                  example: 2024-05-01 17:25:00
 *              status:
 *                  type: string
 *                  enum: ['Черновик', 'Черновик депозита', 'Активный', 'Выставлен счёт', 'Оплачен', 'Отправлен', 'Получен', 'Отменен']
 *                  default: 'Черновик'
 *                  description: Статус заказа
 *                  example: Черновик
 *              billNumber:
 *                  type: string
 *                  nullable: true
 *                  description: Номер счета
 *                  example: 23ФЗ/34
 *              createdBySupAdm:
 *                  type: boolean
 *                  default: false
 *                  description: Флаг, указывающий, был ли заказ создан суперадминистратором
 *                  example: true
 *              orderNumber:
 *                  type: integer
 *                  readOnly: true
 *                  description: Уникальный номер заказа
 *                  example: 24
 *              isFromDeposit:
 *                  type: boolean
 *                  default: false
 *                  description: Флаг, указывающий, был ли заказ оплачен через депозит
 *                  example: true
 * 
 *    Account:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *                  description: Уникальный идентификатор аккаунта
 *                  example: 8800e557-6247-4f12-a9d8-534d59c09318
 *              firstName:
 *                  type: string
 *                  description: Имя пользователя
 *                  example: Максим
 *              lastName:
 *                  type: string
 *                  description: Фамилия пользователя
 *                  example: Ковальский
 *              telephoneNumber:
 *                  type: string
 *                  description: Номер телефона пользователя
 *                  example: +79787513901
 *              telegramId:
 *                  type: string
 *                  nullable: true
 *                  description: Телеграмм ID пользователя
 *                  example: 123232424
 *              organizationList:
 *                  type: array
 *                  items:
 *                      type: string
 *                  nullable: true
 *                  description: Список организация, привязанных к пользователю
 *                  example: ["Джанкой", "Севастополь"]
 *              isBlocked:
 *                  type: boolean
 *                  default: false
 *                  description: Флаг, показывающий заблокирован ли пользователь
 *                  example: false
 *              lastSeen:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *                  description: Последний вход пользователя
 *                  example: 2024-05-01 17:25:00
 *              accountNumber:
 *                  type: integer
 *                  description: Уникальный порядковый номер пользователя
 *                  example: 33
 *     
 *    AccrualRule:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор правила накопления
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            commision:
 *              type: string
 *              format: decimal
 *              description: Комиссия, применимая к правилу накопления
 *              example: 5000
 *            accessType:
 *              type: string
 *              enum: ['Бумажный', 'Электронный']
 *              description: Тип доступа, на который действует правило (может отсутствовать => действует на все типы доступов)
 *              example: Бумажный
 *            generation:
 *              type: string
 *              enum: ['Первое поколение', 'Второе поколение']
 *              description: Поколение, на которое действует правило (может отсутствовать => действует на все поколения)
 *              example: Первое поколение
 * 
 * 
 *    CommisionReceiver:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор получателя комиссии
 *            name:
 *              type: string
 *              description: Имя получателя комиссии
 * 
 * 
 *    OrganizationCustomer:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор организации-клиента
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            organizationName:
 *              type: string
 *              description: Название организации-клиента
 *              example: Уфа
 * 
 * 
 *    Payee:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор плательщика
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            name:
 *              type: string
 *              description: Имя плательщика
 *              example: ИП Климов
 * 
 * 
 *    PriceDefinition:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор определения цены
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            activationDate:
 *              type: string
 *              format: date-time
 *              description: Дата активации определения цены
 *              example: 2024-05-01 17:25:00
 *            priceAccess:
 *              type: string
 *              format: decimal
 *              description: Цена доступа
 *              example: 25500
 *            priceBooklet:
 *              type: string
 *              format: decimal
 *              description: Цена брошюры
 *              example: 1900
 * 
 * 
 * 
 * 
 *    ProductType:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              description: Уникальный идентификатор типа продукта
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            name:
 *              type: string
 *              description: Название типа продукта
 *              example: Начальные
 * 
 * 
 * 
 *    Role:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              description: Уникальный идентификатор роли
 *              example: 1
 *            roleName:
 *              type: string
 *              description: Название роли
 *              example: СуперАдмин
 *            roleDescription:
 *              type: string
 *              description: Описание роли
 *              example: Лишнее поле, хуй пойми зачем оно
 * 
 * 
 * 
 *    TitleOrders:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              format: uuid
 *              description: Уникальный идентификатор заказа названия
 *              example: 8800e557-6247-4f12-a9d8-534d59c09318
 *            accessType:
 *              type: string
 *              enum: ['Бумажный', 'Электронный']
 *              description: Тип доступа к заказу названия
 *              example: Бумажный
 *            generation:
 *              type: string
 *              enum: ['Первое поколение', 'Второе поколение']
 *              description: Генерация заказа названия
 *              example: Первое поколение
 *            addBooklet:
 *              type: boolean
 *              description: Флаг добавления брошюры к заказу (если true, то accessType устанавливается в null)
 *              example: false
 *            quantity:
 *              type: integer
 *              description: Количество заказанных названий
 *              example: 25
 * 
 */







/**
 * @swagger
 * /{accountId}/productsByType/{typeId}:
 *  get:
 *      tags:
 *          - Product
 *      summary: Получить список всех товаров по типу (typeId)
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: typeId
 *          required: true
 *          schema:
 *            type: integer
 *          description: ID категории товаров
 *      responses:
 *        200:
 *          description: |
 *             Категории:
 *              - Начальные
 *              - Основные
 *              - Для сотрудников
 *              - Депозит
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Product'
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */






/**
 * @swagger
 * /{accountId}/orders/newOrder:
 *  post:
 *      tags:
 *          - Order
 *      summary: Запрос POST для создания заказа от лица пользователя
 *      description: Происходит создание заказа со статусом "Черновик" и добавлением в него наименование, в которым все данные о товаре. Если "Черновик" уже есть, то происходит добавление наименование в него. Если пользователь создает депозит, то аналогичная стратегия только вместо "Черновик" => "Черновик депозита" и вместо добавления нового депозита в черновик, пользователь получает сообщение о том, что можно изменить сумму депозита в черновике
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          items:
 *                            $ref: '#/components/schemas/Product'
 *      responses:
 *        200:
 *          description: Товар успешно добавлен в заказ!
 *        400:
 *          description: Измените черновик депозита!
 *        500:
 *          description: |
 *              Ошибки:
 *                  - Ошибка в создании заказа!
 *                  - Ошибка в создании наименования!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */





/**
 * @swagger
 * /{accountId}/orders/{orderId}/active:
 *  put:
 *      tags:
 *          - Order
 *      summary: Запрос PUT для обновления черновика заказа от лица пользователя (НА СТРАНИЦЕ "В РАБОТЕ")
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: orderId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID заказа
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      organizationName:
 *                          type: string
 *                          description: Название организации-клиента
 *                          example: Уфа
 *      responses:
 *        200:
 *          description: Заказ успешно переведён в статус "Активный"!
 *        400:
 *          description: |
 *              Ошибки:
 *                  - Добавьте товары в заказ!
 *                  - Редактировать можно только черновик!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */



/**
 * @swagger
 * /{accountId}/orders/{orderId}/received:
 *  put:
 *      tags:
 *          - Order
 *      summary: Запрос PUT для обновления отправленного заказа на полученный от лица пользователя (НА СТРАНИЦЕ "В РАБОТЕ")
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: orderId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID заказа
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      organizationName:
 *                          type: string
 *                          description: Название организации-клиента
 *                          example: Уфа
 *      responses:
 *        200:
 *          description: Заказ успешно переведён в статус "Получен"!
 *        400:
 *          description: Этот заказ еще не отправлен!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */



/**
 * @swagger
 * /{accountId}/orders:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения всех активных заказов пользователя
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      responses:
 *        200:
 *          description: Все активные заказы
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Все активные заказы"
 *                    orders_list:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                          dispatchDate:
 *                            type: string
 *                            format: date-time
 *                          status:
 *                            type: string
 *                            example: "Выставлен счёт"
 *                          billNumber:
 *                            type: string
 *                            example: "222"
 *                          createdBySupAdm:
 *                            type: boolean
 *                            example: false
 *                          orderNumber:
 *                            type: integer
 *                            example: 156
 *                          isFromDeposit:
*                             type: boolean
*                             default: false
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-21T12:56:42.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-23T09:57:47.000Z"
 *                          organizationCustomerId:
 *                            type: string
 *                            format: uuid
 *                            example: "ff080ca8-c967-47e9-89bd-c3213551ca7f"
 *                          payeeId:
 *                            type: string
 *                            format: uuid
 *                            nullable: true
 *                            example: null
 *                          accountId:
 *                            type: string
 *                            format: uuid
 *                            example: "1f1bbfc0-1621-4ba2-85ac-6ec23c1ef299"
 *                          SUM:
 *                            type: string
 *                            example: "4500"
 *                          organizationName:
 *                            type: string
 *                            example: "Санкт-Петербург"
 *                          TitleOrder:
 *                            type: object
 *                            properties:
 *                              quantity:
 *                                type: decimal
 *                                example: 3
 *                              addBooklet:
 *                                type: boolean
 *                                example: true
 *                              price:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                    type: string
 *                                    format: uuid
 *                                    example: "377c60f7-4bf0-469b-92a9-0c7d6a123314"
 *                                  priceAccess:
 *                                    type: string
 *                                    example: "15000"
 *                                  priceBooklet:
 *                                    type: string
 *                                    example: "1500"
 *                          formattedDispatchDate:
 *                            type: string
 *                            format: date-time
 *                            nullable: true
 *                            example: 02-02-2002
 *        500:
 *          description: Произошла ошибка при получении активных заказов
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */


/**
 * @swagger
 * /{accountId}/orders/finished:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения всех завершенных заказов пользователя
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      responses:
 *        200:
 *          description: Все полученные заказы
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Все полученные заказы"
 *                    orders_list:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                          dispatchDate:
 *                            type: string
 *                            format: date-time
 *                          status:
 *                            type: string
 *                            example: "Получен"
 *                          billNumber:
 *                            type: string
 *                            nullable: true
 *                            example: null
 *                          createdBySupAdm:
 *                            type: boolean
 *                            example: false
 *                          orderNumber:
 *                            type: integer
 *                            example: 1
 *                          isFromDeposit:
 *                            type: boolean
 *                            default: false
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-04-26T11:16:07.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-01T07:53:50.000Z"
 *                          organizationCustomerId:
 *                            type: string
 *                            format: uuid
 *                            example: "1"
 *                          payeeId:
 *                            type: string
 *                            format: uuid
 *                            nullable: true
 *                            example: null
 *                          accountId:
 *                            type: string
 *                            format: uuid
 *                            example: "1"
 *                          SUM:
 *                            type: string
 *                            example: "22222222"
 *                          organizationName:
 *                            type: string
 *                            example: "Симферополь"
 *                          TitleOrder:
 *                            type: object
 *                            properties:
 *                              quantity:
 *                                type: integer
 *                                example: 22222222
 *                              price:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                    type: string
 *                                    format: uuid
 *                                    example: "07ff1130-a1f9-4b12-98a8-c1897c630d19"
 *                                  priceAccess:
 *                                    type: string
 *                                    example: "1"
 *                                  priceBooklet:
 *                                    type: string
 *                                    example: "0"
 *                          formattedDispatchDate:
 *                            type: string
 *                            format: date-time
 *                            nullable: true
 *                            example: 02-02-2002
 *        500:
 *          description: Произошла ошибка при получении активных заказов
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */




/**
 * @swagger
 * /{accountId}/orders/all:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения всех заказов от лица админа
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      responses:
 *        200:
 *          description: Все активные заказы пользователей
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Все активные заказы пользователей"
 *                    orders_list:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                          dispatchDate:
 *                            type: string
 *                            format: date-time
 *                            nullable: true
 *                            example: null
 *                          status:
 *                            type: string
 *                            example: "Выставлен счёт"
 *                          billNumber:
 *                            type: string
 *                            example: "222"
 *                          createdBySupAdm:
 *                            type: boolean
 *                            example: false
 *                          orderNumber:
 *                            type: integer
 *                            example: 156
 *                          isFromDeposit:
 *                            type: boolean
 *                            default: false
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-21T12:56:42.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-23T09:57:47.000Z"
 *                          organizationCustomerId:
 *                            type: string
 *                            format: uuid
 *                            example: "ff080ca8-c967-47e9-89bd-c3213551ca7f"
 *                          payeeId:
 *                            type: string
 *                            format: uuid
 *                            nullable: true
 *                            example: null
 *                          accountId:
 *                            type: string
 *                            format: uuid
 *                            example: "1f1bbfc0-1621-4ba2-85ac-6ec23c1ef299"
 *                          fullName:
 *                            type: string
 *                            example: "Valera Lysenko"
 *                          SUM:
 *                            type: string
 *                            example: "4500"
 *                          organizationName:
 *                            type: string
 *                            example: "Санкт-Петербург"
 *                          totalQuantity:
 *                            type: string
 *                            example: "3"
 *                          organizationList:
 *                            type: array
 *                            items:
 *                              type: JSON
 *                            example: ["Джанкой", "Севастополь"]
 *                          formattedDispatchDate:
 *                            type: string
 *                            format: date-time
 *                            nullable: true
 *                            example: 02-02-2002
 *        500:
 *          description: Произошла ошибка при получении активных заказов
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */


/**
 * @swagger
 * /{accountId}/orders/archive:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения всех архивных заказов от лица админа
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      responses:
 *        200:
 *          description: Архивные заказы (Получен, Отменен)
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Архивные заказы (Получен, Отменен)"
 *                    orders_list:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                          dispatchDate:
 *                            type: string
 *                            format: date-time
 *                            nullable: true
 *                            example: null
 *                          status:
 *                            type: string
 *                            example: "Получен"
 *                          billNumber:
 *                            type: string
 *                            nullable: true
 *                            example: null
 *                          createdBySupAdm:
 *                            type: boolean
 *                            example: false
 *                          orderNumber:
 *                            type: integer
 *                            example: 1
 *                          isFromDeposit:
 *                            type: boolean
 *                            default: false
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-04-26T11:16:07.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-01T07:53:50.000Z"
 *                          organizationCustomerId:
 *                            type: string
 *                            format: uuid
 *                            example: "09as1130-a1f9-4b12-98a8-c1897c630d19"
 *                          payeeId:
 *                            type: string
 *                            format: uuid
 *                            nullable: true
 *                            example: null
 *                          accountId:
 *                            type: string
 *                            format: uuid
 *                            example: "20dd1130-a1f9-4b12-98a8-c1897c630d19"
 *                          fullName:
 *                            type: string
 *                            example: "Максим Ковальски"
 *                          SUM:
 *                            type: string
 *                            example: "22222222"
 *                          organizationName:
 *                            type: string
 *                            example: "Симферополь"
 *                          account:
 *                            type: object
 *                            properties:
 *                              firstName:
 *                                type: string
 *                                example: "Максим"
 *                              lastName:
 *                                type: string
 *                                example: "Ковальски"
 *                          TitleOrder:
 *                            type: object
 *                            properties:
 *                              quantity:
 *                                type: integer
 *                                example: 22222222
 *                              price:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                    type: string
 *                                    format: uuid
 *                                    example: "07ff1130-a1f9-4b12-98a8-c1897c630d19"
 *                                  priceAccess:
 *                                    type: string
 *                                    example: "1"
 *                                  priceBooklet:
 *                                    type: string
 *                                    example: "0"
 *                          organization:
 *                            type: object
 *                            properties:
 *                              id:
 *                                type: string
 *                                format: uuid
 *                                example: "09as1130-a1f9-4b12-98a8-c1897c630d19"
 *                              organizationName:
 *                                type: string
 *                                example: "Симферополь"
 *                              createdAt:
 *                                type: string
 *                                format: date-time
 *                                nullable: true
 *                                example: null
 *                              updatedAt:
 *                                type: string
 *                                format: date-time
 *                                nullable: true
 *                                example: null
 *                          formattedDispatchDate:
 *                            type: string
 *                            format: date-time
 *                            nullable: true
 *                            example: 02-02-2002
 *        500:
 *          description: Произошла ошибка при получении архивных заказов
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */



/**
 * @swagger
 * /{accountId}/orders/admin/{orderId}:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения деталей (Всех TitleOrders и OrganizationCustomer) для выбранного заказа от лица админа
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: orderId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID заказа
 *      responses:
 *        200:
 *          description: Детали заказа
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Детали заказа"
 *                    order:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          format: uuid
 *                          example: "4afc1f16-752d-41c2-951b-59db3e170bed"
 *                        dispatchDate:
 *                          type: string
 *                          format: date-time
 *                          example: "2024-05-13T10:57:47.000Z"
 *                        status:
 *                          type: string
 *                          example: "Активный"
 *                        billNumber:
 *                          type: string
 *                          example: "123456789"
 *                        createdBySupAdm:
 *                          type: boolean
 *                          example: true
 *                        orderNumber:
 *                          type: integer
 *                          example: 36
 *                        isFromDeposit:
 *                          type: boolean
 *                          example: false
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2024-05-13T10:57:47.000Z"
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2024-05-13T12:05:06.000Z"
 *                        organizationCustomerId:
 *                          type: string
 *                          example: "1"
 *                        payeeId:
 *                          type: string
 *                          example: "2"
 *                        accountId:
 *                          type: string
 *                          example: "1"
 *                        SUM:
 *                          type: string
 *                          example: "515200"
 *                        payeeName:
 *                          type: string
 *                          example: "Иван Иванов"
 *                        organizationName:
 *                          type: string
 *                          example: "Симферополь"
 *                        TitleOrder:
 *                          type: object
 *                          properties:
 *                            quantity:
 *                              type: integer
 *                              example: 1
 *                            price:
 *                              type: object
 *                              properties:
 *                                priceAccess:
 *                                  type: string
 *                                  example: "8000"
 *                                priceBooklet:
 *                                  type: string
 *                                  example: "500"
 *                        organization:
 *                          type: object
 *                          properties:
 *                            organizationName:
 *                              type: string
 *                              example: "Симферополь"
 *                        payee:
 *                          type: object
 *                          properties:
 *                            name:
 *                              type: string
 *                              example: "ООО Примерная Компания"
 *                    titles:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                            example: "328425da-89a5-41cb-a753-3cd626dcca9b"
 *                          accessType:
 *                            type: string
 *                            example: "Бумажный"
 *                          generation:
 *                            type: string
 *                            example: "Первое поколение"
 *                          addBooklet:
 *                            type: boolean
 *                            example: false
 *                          quantity:
 *                            type: integer
 *                            example: 4
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-13T10:57:47.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-13T10:57:47.000Z"
 *                          productId:
 *                            type: string
 *                            format: uuid
 *                            example: "01584925-5783-428b-a592-e886cb8dca50"
 *                          orderId:
 *                            type: string
 *                            format: uuid
 *                            example: "4afc1f16-752d-41c2-951b-59db3e170bed"
 *                          priceDefId:
 *                            type: string
 *                            format: uuid
 *                            example: "377c60f7-4bf0-469b-92a9-0c7d6a123314"
 *                          SumForOneTitle:
 *                            type: string
 *                            example: "60000"
 *                          PriceForOneProduct:
 *                            type: string
 *                            example: "15000"
 *                          product:
 *                            type: object
 *                            properties:
 *                              abbreviation:
 *                                type: string
 *                                example: "НОП"
 *                          price:
 *                            type: object
 *                            properties:
 *                              priceAccess:
 *                                type: string
 *                                example: "15000"
 *                              priceBooklet:
 *                                type: string
 *                                example: "1500"
 *        404:
 *          description: Заказ не найден
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */




/**
 * @swagger
 * /{accountId}/orders/{orderId}:
 *  get:
 *      tags:
 *          - Order
 *      summary: Запрос GET для получения деталей (Всех TitleOrders) для выбранного заказа от лица пользователя
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: orderId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID заказа
 *      responses:
 *        200:
 *          description: Детали заказа
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                      example: "Детали заказа"
 *                    order:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                          format: uuid
 *                          example: "4afc1f16-752d-41c2-951b-59db3e170bed"
 *                        dispatchDate:
 *                          type: string
 *                          format: date-time
 *                          nullable: true
 *                          example: null
 *                        status:
 *                          type: string
 *                          example: "Активный"
 *                        billNumber:
 *                          type: string
 *                          nullable: true
 *                          example: null
 *                        createdBySupAdm:
 *                          type: boolean
 *                          example: false
 *                        orderNumber:
 *                          type: integer
 *                          example: 36
 *                        isFromDeposit:
 *                          type: boolean
 *                          example: false
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2024-05-13T10:57:47.000Z"
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          example: "2024-05-13T12:05:06.000Z"
 *                        organizationCustomerId:
 *                          type: string
 *                          example: "1"
 *                        payeeId:
 *                          type: string
 *                          nullable: true
 *                          example: null
 *                        accountId:
 *                          type: string
 *                          example: "1"
 *                        SUM:
 *                          type: string
 *                          example: "515200"
 *                        TitleOrder:
 *                          type: object
 *                          properties:
 *                            quantity:
 *                              type: integer
 *                              example: 1
 *                            price:
 *                              type: object
 *                              properties:
 *                                priceAccess:
 *                                  type: string
 *                                  example: "500"
 *                                priceBooklet:
 *                                  type: string
 *                                  example: "100"
 *                    titles:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            format: uuid
 *                            example: "14f3b337-99e8-4c31-af6b-ca60baa96181"
 *                          accessType:
 *                            type: string
 *                            example: "Бумажный"
 *                          generation:
 *                            type: string
 *                            example: "Первое поколение"
 *                          addBooklet:
 *                            type: boolean
 *                            example: false
 *                          quantity:
 *                            type: integer
 *                            example: 1
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-13T12:04:17.000Z"
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            example: "2024-05-13T12:04:17.000Z"
 *                          productId:
 *                            type: string
 *                            format: uuid
 *                            example: "f2c5e486-fa98-412b-aa26-c9f00fa4c94c"
 *                          orderId:
 *                            type: string
 *                            format: uuid
 *                            example: "4afc1f16-752d-41c2-951b-59db3e170bed"
 *                          priceDefId:
 *                            type: string
 *                            format: uuid
 *                            example: "2b00b36c-26e4-43ce-873d-467530a40c27"
 *                          SumForOneTitle:
 *                            type: string
 *                            example: "500"
 *                          PriceForOneProduct:
 *                            type: string
 *                            example: "500"
 *                          product:
 *                            type: object
 *                            properties:
 *                              abbreviation:
 *                                type: string
 *                                example: "ТП"
 *                          price:
 *                            type: object
 *                            properties:
 *                              priceAccess:
 *                                type: string
 *                                example: "500"
 *                              priceBooklet:
 *                                type: string
 *                                example: "100"
 *        404:
 *          description: Заказ не найден
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */





/**
 * @swagger
 * /{accountId}/orders/{orderId}/delete/{titleId}:
 *  delete:
 *      tags:
 *          - TitleOrders
 *      summary: Запрос DELETE для удаления ОДНОГО! TitleOrder в заказе
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: orderId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID заказа
 *        - in: path
 *          name: titleId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID наименования
 *      responses:
 *        200:
 *          description: Наименование успешно удалено!
 *        404:
 *          description: Наименование не найдено!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */



/**
 * @swagger
 * /{accountId}/orders/admin/{orderId}/update:
 *  put:
 *      tags:
 *          - TitleOrders
 *      summary: Запрос PUT для обновления ВСЕХ! TitleOrder в заказе от лица админа
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: orderId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID заказа
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                      status:
 *                                        type: string
 *                                        enum: ['Черновик', 'Черновик депозита', 'Активный', 'Выставлен счёт', 'Оплачен', 'Отправлен', 'Получен', 'Отменен']
 *                                        example: 'Активный' 
 *                                      organizationName:
 *                                        type: string
 *                                        description: Название организации-клиента
 *                                        example: 'Уфа'
 *                                      billNumber:
 *                                        type: string
 *                                        description: Номер счета
 *                                        example: '23ФЗ|22'
 *                                      payeeId:
 *                                        type: string
 *                                        format: uuid
 *                                        description: ID получателя платежа
 *                                        example: '1c12df6d-11ed-46e2-93d9-e91d07c0a6d0'
 *                                      titlesToUpdate:
 *                                        type: array
 *                                        items:
 *                                          type: object
 *                                          properties:
 *                                            id:
 *                                              type: string
 *                                              description: ID наименования
 *                                              format: uuid
 *                                              example: '1c12df6d-11ed-46e2-93d9-e91d07c0a6d0'
 *                                            productId:
 *                                              type: string
 *                                              description: ID товара
 *                                              format: uuid
 *                                              example: '2222df6d-11ed-46e2-93d9-e91d07c0a6d0'
 *                                            accessType:
 *                                              type: string
 *                                              description: Тип доступа
 *                                              example: 'Бумажный'
 *                                            addBooklet:
 *                                              type: boolean
 *                                              description: Флаг добавления брошюры к заказу (если true, то accessType уст             анавливается в null)
 *                                              example: false
 *                                            generation:
 *                                              type: string
 *                                              description: Поколение товара
 *                                              example: 'Второе поколения'
 *                                            quantity:
 *                                                type: integer
 *                                                description: Количество товара 
 *                                                example: 20
 *      responses:
 *        200:
 *          description: Наименования успешно обновлены
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */




/**
 * @swagger
 * /{accountId}/orders/{orderId}/update:
 *  put:
 *      tags:
 *          - TitleOrders
 *      summary: Запрос PUT для обновления ВСЕХ! TitleOrder в заказе от лица пользователя
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *        - in: path
 *          name: orderId
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *          description: ID заказа
 *      requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  titlesToUpdate:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                  type: string
 *                                                  description: ID наименования
 *                                                  format: uuid
 *                                                  example: 1c12df6d-11ed-46e2-93d9-e91d07c0a6d0
 *                                              productId:
 *                                                  type: string
 *                                                  description: ID товара
 *                                                  format: uuid
 *                                                  example: 2222df6d-11ed-46e2-93d9-e91d07c0a6d0
 *                                              accessType:
 *                                                  type: string
 *                                                  description: Тип доступа
 *                                                  example: Бумажный
 *                                              addBooklet:
 *                                                  type: boolean
 *                                                  description: Флаг добавления брошюры к заказу (если true, то accessTy           pe устанавливается в null) 
 *                                                  example: false
 *                                              generation:
 *                                                  type: string
 *                                                  description: Поколение товара 
 *                                                  example: Второе поколения
 *                                              quantity:
 *                                                  type: integer
 *                                                  description: Количество товара 
 *                                                  example: 20
 *      responses:
 *        200:
 *          description: Наименования успешно обновлены
 *        400:
 *          description: Выберите тип доступа!
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */






/**
 * @swagger
 * /{accountId}/payees:
 *  get:
 *      tags:
 *          - Payee
 *      summary: Запрос GET для получения всех получателей платежей (Payee)
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      responses:
 *        200:
 *          description: Список получателей платежа
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */




/**
 * @swagger
 * /{accountId}/payees/newPayee:
 *  get:
 *      tags:
 *          - Payee
 *      summary: Запрос GET для получения формы для создания нового получателя платежа (Payee)
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      responses:
 *        200:
 *          description: Список получателей платежа
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */


/**
 * ТУТ ШО ТО С PAYEE
 */





/**
 * @swagger
 * /{accountId}/prices:
 *  get:
 *      tags:
 *          - PriceDefinition
 *      summary: Запрос GET для получения всех прайс листов(PriceDefinition)
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      responses:
 *        200:
 *          description: Список прайс листов
 *          content:
 *            application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      title:
 *                        type: string
 *                        example: "Список прайс листов"
 *                      pricesInit:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              format: uuid
 *                              example: "377c60f7-4bf0-469b-92a9-0c7d6a123314"
 *                            activationDate:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            priceAccess:
 *                              type: string
 *                              example: "15000"
 *                            priceBooklet:
 *                              type: string
 *                              example: "1500"
 *                            createdAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            updatedAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            productId:
 *                              type: string
 *                              format: uuid
 *                              example: "01584925-5783-428b-a592-e886cb8dca50"
 *                            Product:
 *                                  $ref: '#/components/schemas/Product'
 *                      pricesMain:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              format: uuid
 *                              example: "377c60f7-4bf0-469b-92a9-0c7d6a123314"
 *                            activationDate:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            priceAccess:
 *                              type: string
 *                              example: "15000"
 *                            priceBooklet:
 *                              type: string
 *                              example: "1500"
 *                            createdAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            updatedAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            productId:
 *                              type: string
 *                              format: uuid
 *                              example: "01584925-5783-428b-a592-e886cb8dca50"
 *                            Product:
 *                                  $ref: '#/components/schemas/Product'
 *                      pricesForEmployers:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: string
 *                              format: uuid
 *                              example: "377c60f7-4bf0-469b-92a9-0c7d6a123314"
 *                            activationDate:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            priceAccess:
 *                              type: string
 *                              example: "15000"
 *                            priceBooklet:
 *                              type: string
 *                              example: "1500"
 *                            createdAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            updatedAt:
 *                              type: string
 *                              format: date-time
 *                              example: "2024-04-22T13:27:24.000Z"
 *                            productId:
 *                              type: string
 *                              format: uuid
 *                              example: "01584925-5783-428b-a592-e886cb8dca50"
 *                            Product:
 *                                  $ref: '#/components/schemas/Product'
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */




/**
 * @swagger
 * /{accountId}/prices/newPrice:
 *  get:
 *      tags:
 *          - PriceDefinition
 *      summary: Запрос GET для получения формы для создания нового прайс листа (PriceDefinition)
 *      parameters:
 *        - in: path
 *          name: accountId
 *          required: true
 *          schema:
 *            type: string
 *            format: uuid
 *          description: ID пользователя
 *      responses:
 *        200:
 *          description: Форма создания прайс листа
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                      name:
 *                          type: string
 *                          description: Название товара
 *                          example: Начальный курс
 *                      abbreviation:
 *                          type: string
 *                          description: Аббревиатура товара
 *                          example: НК
 *                      priceAccess:
 *                          type: decimal
 *                          description: Цена за доступ к товару
 *                          example: 6700
 *                      priceBooklet:
 *                          type: decimal
 *                          description: Цена за буклет
 *                          example: 500
 *                          
 *        403:
 *          description: У вас нет прав доступа или вы были заблокированы!
 */

