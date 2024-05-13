const sequelize = require('../database/connection');
const { defineAbilitiesFor } = require('./accessPolitics');
const Account = require("../models/account");


const checkAbilities = (action, subject) => {
  return async (req, res, next) => {
    const sessionId = req.sessionID;
    console.log(`checkability ${sessionId}`)
    try {
      const accountId = await getAccountIdFromSession(sessionId);
      const account = await getAccountById(req.params.accountId);
      console.log(`checkability ${accountId}`);
      console.log(`checkability ${account.id}`)
      if (!account) {
        return res.status(404).send('Такого аккаунта не существует');
      }
      
      const ability = defineAbilitiesFor(account);
      if (accountId === account.id) {

        if (ability.can(action, subject)) {
          next();
        }
      }
      else {
        console.log('403')
        res.status(403).send('У вас нет прав доступа или вы были заблокированы!');
      }
    }
    catch (error) {
      console.log(error)
      console.log('401')
      res.status(401).send('Пройдите аутентификацию через телеграмм бота!');
    }


  };
};




async function getAccountById(accountId) {
  const account = await Account.findOne({ where: { id: accountId } });
  return account;
}



async function getAccountIdFromSession(sessionID) {
  const sqlQuery = `
    SELECT JSON_EXTRACT(data, '$.accountId') AS accountId
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
      return results[0].accountId;
    } else {
      throw new Error('Session not found');
    }
  } catch (error) {
    console.log(`/checkability error`)
    console.error('Error:', error);
    throw error; // Перебрасываем ошибку, чтобы она могла быть обработана вызывающей функцией
  }
}

module.exports = checkAbilities;
