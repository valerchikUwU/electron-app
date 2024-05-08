
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

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Здесь вы можете добавить логику для отправки событий об аутентификации
  res.write(`data: ${JSON.stringify({ type: 'auth', success: true })}\n\n`);
});
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