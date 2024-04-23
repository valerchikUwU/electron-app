const express = require('express');
const authRoutes = require('./routes/authRoutes');
const allRoutes = require('./routes/allRoutes');
const app = express();
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', allRoutes );


// Запуск Express сервера
const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});