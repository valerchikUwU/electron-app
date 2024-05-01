

const { defineAbilitiesFor } = require('./accessPolitics');
const Account = require("../models/account");



const checkAbilities = (action, subject) => {
 return async (req, res, next) => {
    const account = await getAccountById(req.params.accountId);
    if (!account) {
      return res.status(404).send('Такого аккаунта не существует');
    }

    const ability = defineAbilitiesFor(account);
    if (ability.can(action, subject)) {
      next();
    } 
    else {
      res.status(403).send('У вас нет прав доступа или вы были заблокированы!');
    }
 };
};




async function getAccountById(accountId) {
    const account = await Account.findOne({ where: { id: accountId } });
    return account;
  }

module.exports = checkAbilities;
