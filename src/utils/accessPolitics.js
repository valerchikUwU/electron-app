const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilitiesFor(account) {
 const { can, cannot, rules } = new AbilityBuilder(Ability);

 switch (account.roleId) {
    case 1: // СуперАдмин
      can('manage', 'all'); // СуперАдмин может управлять всем
      break;
    case 2: // Админ
      can('read', 'all'); // Админ может читать все
      can('create', ['Order', 'Account', 'organizationCustomer', 'PriceDefinition']); // Админ может создавать заказы
      can('update', ['Order', 'Account', 'PriceDefinition', 'TitleOrders']); // Админ может обновлять заказы
      break;
    case 3: // Пользователь
      can('read', ['Order', 'Product', 'TitleOrder']); // Пользователь может читать свои заказы
      can('create', ['Order', 'TitleOrder']); // Пользователь может создавать заказы
      can('update', ['Order', 'TitleOrder'], { accountId: account.id }); // Пользователь может обновлять свои заказы
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