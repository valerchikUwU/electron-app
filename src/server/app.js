
require('dotenv').config();
const express = require('express');
const compression = require("compression");
const cors = require('cors');
const helmet = require("helmet");
const authRoutes = require('./routes/authRoutes');
const allRoutes = require('./routes/allRoutes');
const app = express();
const swaggerJSDoc = require('swagger-jsdoc');



const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};


const swaggerSpec = swaggerJSDoc(options);



// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

// Включаем CORS для всех маршрутов
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', allRoutes );

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    console.error(err.stack); // Запись стека ошибки в консоль
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    res.status(500).send(res.locals.message || 'Internal Server Error');
  });


// Запуск Express сервера
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});