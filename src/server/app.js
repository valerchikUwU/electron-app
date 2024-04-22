const express = require('express');
const authRoutes = require('./routes/authRoutes');
const allRoutes = require('./routes/allRoutes');
const Account = require('../models/account');
const app = express();
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', allRoutes );

const account = Account.findAll()
console.log(account.id)
// Запуск Express сервера
const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});