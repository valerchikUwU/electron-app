const express = require('express');
const authRoutes = require('./routes/authRoutes');
const allRoutes = require('./routes/allRoutes');
const app = express();
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

//СМОТРЕЛ middleware ОБРАБОТЧИК ОШИБОК И ОСТАНОВИЛСЯ НА TRY CATCH в OrdersController 

// Запуск Express сервера
const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});