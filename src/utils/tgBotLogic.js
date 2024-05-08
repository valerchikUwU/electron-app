const { Telegraf, Markup } = require('telegraf');
const fetch = require('node-fetch'); 
require('dotenv').config();

const apiRoot = process.env.API_ROOT;



async function startBot() {
    if (!process.env.BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');
    const bot = new Telegraf(process.env.BOT_TOKEN);

    bot.start((ctx) => {
        ctx.reply('Добро пожаловать в бота! Чтобы зарегистрироваться отправьте номер вашего телефона, нажав на кнопку ниже:',
            {
                reply_markup: {
                    keyboard: [
                        [{ text: 'Поделиться контактом', request_contact: true }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
    });

    bot.on('contact', async (ctx) => {
        const phoneNumber = formatPhoneNumber(ctx.message.contact.phone_number);
        const telegramId = ctx.message.contact.user_id;
        const response = await fetch(`${apiRoot}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone: phoneNumber , id: telegramId}),
        });
        const data = await response.json();
        if (data.success) {
            ctx.reply('Вход успешен!');
        } else {
            ctx.reply('Такого номера нет');
        }
    });

    bot.launch();
}


function formatPhoneNumber(phoneNumber) {
    // Проверяем, начинается ли номер телефона с "+", если нет, добавляем
    if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+' + phoneNumber;
    }
    return phoneNumber;
}

module.exports = { startBot };
