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
      can('read',   ['OrderAdmin', 'Account', 'PriceDefinition', 'Deposit']); // Админ может читать все
      can('create', ['OrderAdmin', 'Account', 'PriceDefinition']); // Админ может создавать заказы
      can('update', ['OrderAdmin', 'Account', 'PriceDefinition', 'TitleOrder_Admin']); // Админ может обновлять заказы
      break;
    case 3: // Пользователь
      can('read',   ['OrderUser', 'Product', 'TitleOrder_User']); // Пользователь может читать свои заказы
      can('create', ['OrderUser', 'TitleOrderUser']); // Пользователь может создавать заказы
      can('update', ['OrderUser', 'TitleOrderUser'], { accountId: account.id }); // Пользователь может обновлять свои заказы
      can('delete', ['TitleOrder'], { accountId: account.id }); // Пользователь может удалять свои наименования
      break;
    default:
      // Политика по умолчанию, если роль не определена
      cannot('manage', 'none');
 }

 return new Ability(rules);
}

//  if (account.roleId === 1) { // СуперАдмин
//     can('manage', 'all'); // СуперАдмин может управлять всем
//  } else if (account.roleId === 2) { // Админ
//     can('manage', 'Account'); // Админ может управлять аккаунтами
//     can('delete', 'Account'); // Но не может удалять аккаунты
//  } else if (account.roleId === 3) { // Пользователь
//     can('read', 'Account'); // Пользователь может читать аккаунты
//  }

module.exports = { defineAbilitiesFor };