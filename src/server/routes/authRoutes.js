require('dotenv').config();
const { startBot } = require('../../utils/tgBotLogic'); 
const  Account  = require('../../models/account');
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const sequelize = require('../../database/connection');

const apiRoot = process.env.API_ROOT;


router.post('/auth', async (req, res) => {
    const phoneNumber = req.body.phone;
    const id = req.body.id;
    const token = req.body.token
    const sessionId = req.body.sessionId
    const foundNumber = await getTelephoneNumber(phoneNumber);
    
    const generatedToken = await getGeneratedToken(sessionId);
    console.log(generatedToken);
    if(generatedToken === token){
        if (foundNumber) {                
            Account.update({telegramId: id}, {where: {telephoneNumber: foundNumber}});
            const account = await Account.findOne({where: { telephoneNumber: foundNumber}})
            const accountId = account.id
            // Передаем accountId через URL
            res.redirect(`${apiRoot}/${accountId}/productsByType/1`);
        } else {
            res.status(404).json({message: 'Номер телефона не найден'});
        }
    }
    else {
        console.log('Ошибка аутентификации!')
        res.status(401).json({message: 'Ошибка аутентификации!'})
    }
    
});


router.get('/homepage', async (req, res) => {
    const token = crypto.randomBytes(10).toString('hex')
    req.session.generatedToken = token;
    console.log(req.session.generatedToken)
    console.log(req.sessionID)
    res.json({
        token: token,
        sessionId: req.sessionID,
    });
})





// Запуск бота
startBot();



async function getTelephoneNumber(telephoneNumber) {
    try {
        const account = await Account.findOne({
            where: {
                telephoneNumber: telephoneNumber
            }
        });
        if (account) {
            return account.telephoneNumber;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching telephone number:', error);
        return null;
    }
}


async function getGeneratedToken(sessionId) {
    const sqlQuery = `
      SELECT JSON_EXTRACT(data, '$.generatedToken') AS generatedToken
      FROM sessions
      WHERE session_id = :sessionId
    `;
  
    try {
      const results = await sequelize.query(sqlQuery, {
        replacements: { sessionId: sessionId },
        type: sequelize.QueryTypes.SELECT
      });
  
      if (results.length > 0) {
        // Возвращаем значение generatedToken
        return results[0].generatedToken;
      } else {
        throw new Error('Session not found');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error; // Перебрасываем ошибку, чтобы она могла быть обработана вызывающей функцией
    }
  }


module.exports = router;

















// require('dotenv').config();

// const { Telegraf, Markup } = require('telegraf');
// const express = require('express');
// const bodyParser = require('body-parser');
// const  Account  = require('../models/account');
// const app = express();



// app.use(bodyParser.json());

// // Маршрут для обработки запросов от бота
// app.post('/check-phone', async (req, res) => {
//         const phoneNumber = req.body.phone;
//         // Здесь вы проверяете номер телефона в базе данных
//         const foundNumber = await getTelephoneNumber(phoneNumber);
//         if (foundNumber) {
//         res.send({ success: true });
//         } else {
//         res.send({ success: false });
//         }
//    });



// if (!process.env.BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');
//   const bot = new Telegraf(process.env.BOT_TOKEN);
  
  
//   // Обработка команды /start
//     bot.start((ctx) => {
//         ctx.reply('Добро пожаловать в бота! Чтобы зарегистрироваться отправьте номер вашего телефона, нажав на кнопку ниже:',
//         {
//             reply_markup: {
//                 keyboard: [
//                     [{text: 'Поделиться контактом', request_contact: true}]
//                 ],
//                 resize_keyboard: true,
//                 one_time_keyboard: true
//             }
//         });
//     });



//   bot.on('contact', (ctx) => {
//     const phoneNumber = formatPhoneNumber(ctx.message.contact.phone_number);
//     fetch('http://localhost:3000/check-phone', {
//         method: 'POST',
//         headers: {
//         'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ phone: phoneNumber }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//           ctx.reply('Вход успешен!');
//         } else {
//           ctx.reply('Такого номера нет');
//         }
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         ctx.reply('Произошла ошибка при проверке номера телефона');
//       });



//     console.log(`Your number: ${phoneNumber}`);

//     });
//   bot.launch();

//   // Запуск Express сервера
// const PORT = 3000;
// app.listen(PORT, () => {
//  console.log(`Server is running on port ${PORT}`);
// });




// // Получить номер телефона из БД
// async function getTelephoneNumber(telephoneNumber) {
//     try {
//         const account = await Account.findOne({
//             where: {
//                 telephoneNumber: telephoneNumber
//             }
//         });
//         if (account) {
//             console.log('Telephone Number:', account.telephoneNumber);
//             return account.telephoneNumber;
//         } else {
//             console.log('Account not found');
//             return null;
//         }
//     } catch (error) {
//         console.error('Error fetching telephone number:', error);
//         return null;
//     }
// }


// // На телефоне номер возвращается без "+", десктоп наоборот
// function formatPhoneNumber(phoneNumber) {
//     // Проверяем, начинается ли номер телефона с "+", если нет, добавляем
//     if (!phoneNumber.startsWith('+')) {
//         phoneNumber = '+' + phoneNumber;
//     }
//     return phoneNumber;
// }