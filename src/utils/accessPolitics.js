const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilitiesFor(account) {
 const { can, cannot, rules } = new AbilityBuilder(Ability);


// Если аккаунт заблокирован, запрещаем все действия
if (account.isBlocked) {
   cannot('manage', 'all');
   return new Ability(rules);
}

 switch (account.roleId) {
    case 1: // СуперАдмин
      can('manage', 'all'); // СуперАдмин может управлять всем
      break;
    case 2: // Админ
      can('read',   ['Order_Admin', 'Account', 'PriceDefinition', 'Deposit']); // Админ может читать все
      can('create', ['Order_Admin', 'Account', 'PriceDefinition']); // Админ может создавать заказы
      can('update', ['Order_Admin', 'Account', 'PriceDefinition', 'TitleOrder_Admin']); // Админ может обновлять заказы
      break;
    case 3: // Пользователь
      can('read',   ['Order_User', 'Product', 'TitleOrder_User']); // Пользователь может читать свои заказы
      can('create', ['Order_User', 'TitleOrder_User']); // Пользователь может создавать заказы
      can('update', ['Order_User', 'TitleOrder_User'], { accountId: account.id }); // Пользователь может обновлять свои заказы
      can('delete', ['TitleOrder_User'], { accountId: account.id }); // Пользователь может удалять свои наименования
      break;
    default:
      // Политика по умолчанию, если роль не определена
      cannot('manage', 'none');
 }

 return new Ability(rules);
}


module.exports = { defineAbilitiesFor };