require('dotenv').config();
const { startBot } = require('../../utils/tgBotLogic'); 
const express = require('express');
const router = express.Router();
const sequelize = require('../../database/connection');
const WebSocket = require('ws');
const url = require('url');
const Account = require('../../models/account');
const crypto = require('crypto');


const apiRoot = process.env.API_ROOT;
const wss = new WebSocket.Server({ port: 8080 });
const connections = {};

wss.on('connection', (ws, req) => {
    console.log(url.parse(req.url, true).query);
    const obj = url.parse(req.url, true).query
    const sessionId = obj.sessionId;
    console.log(`WSSSSSS: ${sessionId}`) // Получаем sessionId из сессии
    connections[sessionId] = ws; // Сохраняем WebSocket соединение
  });





router.post('/auth', async (req, res) => {
    const phoneNumber = req.body.phone;
    const id = req.body.id;
    const token = req.body.token;
    const sessionId = req.body.sessionId;

    try {
        const foundNumber = await getTelephoneNumber(phoneNumber);
        const generatedToken = await getGeneratedToken(sessionId);
        console.log(`/auth: ${token}`);
        console.log(`/auth: ${generatedToken}`);
        if (generatedToken === token) {
            if (foundNumber) {
                Account.update({ telegramId: id }, { where: { telephoneNumber: foundNumber } });
                const account = await Account.findOne({ where: { telephoneNumber: foundNumber } });
                const accountId = account.id;
                account.lastSeen = new Date()
                
              
                // Передаем accountId через URL
                sendMessageToClient(sessionId, accountId);
                await setSessionAccountId(sessionId, accountId);
                res.status(200).json({message: 'Вы успешно аутентифицированы'});
            } else {
                res.status(404).json({ message: 'Номер телефона не найден' });
            }
        } else {
            sendMessageToClient(sessionId, 'false')
            console.log('Ошибка аутентификации!');
            res.status(401).json({ message: 'Ошибка аутентификации!' });
        }
    } catch (error) {
        // Обработка ошибок, возникающих при обращении к базе данных
        console.error('Ошибка при запросе к БД:', error);
        res.status(500).json({ message: 'Что - то пошло не так!' });
    }
});



router.get('/homepage', async (req, res) => {
    const token = crypto.randomBytes(10).toString('hex')
    req.session.generatedToken = token;
    console.log(`/homepage: ${req.session.generatedToken}`)
    console.log(`/homepage: ${req.sessionID}`)
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




async function setSessionAccountId(sessionID, accountId){
    try {
        const updatedRows = await sequelize.query(
          `UPDATE sessions SET data = JSON_SET(data, '$.accountId', :accountId) WHERE session_id = :sessionId`,
          {
            replacements: { sessionId: sessionID, accountId: accountId },
            type: sequelize.QueryTypes.UPDATE
          }
        );
        console.log(`setSessionAccountId ${updatedRows[1]}`)
        if (updatedRows[1] > 0) {
          console.log(`Updated ${updatedRows} rows.`);
          return true;
        } else {
          throw new Error('No rows updated');
        }
      } catch (error) {
        console.error('Error updating generatedToken:', error);
        throw error; // Перебрасываем ошибку, чтобы она могла быть обработана вызывающей функцией
      }
}

async function getGeneratedToken(sessionID) {
    const sqlQuery = `
      SELECT JSON_EXTRACT(data, '$.generatedToken') AS generatedToken
      FROM sessions
      WHERE session_id = :sessionId
    `;
  
    try {
      const results = await sequelize.query(sqlQuery, { 
        replacements: { sessionId: sessionID },
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


  function sendMessageToClient(sessionId, message) {
    const ws = connections[sessionId];
    if (ws) {
        console.log(`ot servera klienty: ${message}`)
        const jsonMessage = JSON.stringify({ message });
      ws.send(jsonMessage);
    } else {
      console.error('WebSocket connection not found for sessionId:', sessionId);
    }
  }


  // Предположим, что у вас есть функция, которая вызывается после успешной аутентификации
function onAuthSuccess(sessionId) {
    const message = 'Аутентификация прошла успешно!';
    sendMessageToClient(sessionId, message);
  }


module.exports = router;
exports.getGeneratedToken = getGeneratedToken;