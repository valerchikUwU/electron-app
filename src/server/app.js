
require('dotenv').config();
const express = require('express');
const compression = require("compression");
const cors = require('cors');
const helmet = require("helmet");
const authRoutes = require('./routes/authRoutes');
const allRoutes = require('./routes/allRoutes');
const app = express();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const API_ROOT = process.env.API_ROOT;
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);


const optionsStore = {
	host: process.env.host,
	port: process.env.port,
	user: process.env.db_user,
	password: process.env.password,
	database: process.env.db_name,
  // Whether or not to automatically check for and clear expired sessions:
	clearExpired: true,
	// How frequently expired sessions will be cleared; milliseconds:
	checkExpirationInterval: 900000,
	// The maximum age of a valid session; milliseconds:
	expiration: 3600000,
	// Whether or not to create the sessions database table, if one does not already exist:
	createDatabaseTable: true,
	// Whether or not to end the database connection when the store is closed.
	// The default value of this option depends on whether or not a connection was passed to the constructor.
	// If a connection object is passed to the constructor, the default value for this option is false.
	endConnectionOnClose: true,
};

const sessionStore = new MySQLStore(optionsStore);
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for electron-app',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from electron-app.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'electron-app',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: API_ROOT,
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['C:/Users/koval/electron-store-app/electron-app/src/server/routes/*.js'],
};


const swaggerSpec = swaggerJSDoc(options);



// // Set up rate limiter: maximum of twenty requests per minute
// const RateLimit = require("express-rate-limit");
// const limiter = RateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 20,
// });
// // Apply rate limiter to all requests
// app.use(limiter);


// Включаем CORS для всех маршрутов
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// Настройка сессии
app.use(session({
  secret: process.env.SESSION_SECRET, // Секретный ключ для подписи сессии
  store: sessionStore,
  resave: false, // Не сохранять сессию при каждом запросе, если она не изменилась
  saveUninitialized: false, // Сохранять сессию, если она была инициализирована, но не изменена
  cookie: { secure: false } // Установите secure в true, если используете HTTPS
}));


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', authRoutes);
app.use('/api', allRoutes );


  
  // // error handler
  // app.use(function (err, req, res, next) {
  //   console.error(err.stack); // Запись стека ошибки в консоль
  //   res.locals.message = err.message;
  //   res.locals.error = req.app.get("env") === "development" ? err : {};
  
  //   res.status(500).send(res.locals.message || 'Internal Server Error');
  // });


// Запуск Express сервера
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});