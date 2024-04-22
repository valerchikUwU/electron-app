const { Telegraf, Markup } = require('telegraf');
const fetch = require('node-fetch'); // Убедитесь, что у вас установлен node-fetch для использования fetch в Node.js



function formatPhoneNumber(phoneNumber) {
    // Проверяем, начинается ли номер телефона с "+", если нет, добавляем
    if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+' + phoneNumber;
    }
    return phoneNumber;
}

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
        const response = await fetch('http://localhost:3000/api/auth', {
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

module.exports = { startBot };
