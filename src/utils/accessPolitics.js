const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilitiesFor(account) {
 const { can, cannot, rules } = new AbilityBuilder(Ability);


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