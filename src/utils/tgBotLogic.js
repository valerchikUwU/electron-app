const { Telegraf, Markup } = require('telegraf');
const fetch = require('node-fetch');
require('dotenv').config();
const LocalSession = require('telegraf-session-local')

const apiRoot = process.env.API_ROOT;



async function startBot() {
    if (!process.env.BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');
    const bot = new Telegraf(process.env.BOT_TOKEN);

    const localSession = new LocalSession({
        // Database name/path, where sessions will be located (default: 'sessions.json')
        database: 'example_db.json',
        // Name of session property object in Telegraf Context (default: 'session')
        property: 'session',
        // Type of lowdb storage (default: 'storageFileSync')
        storage: LocalSession.storageFileAsync,
        // Format of storage/database (default: JSON.stringify / JSON.parse)
        format: {
            serialize: (obj) => JSON.stringify(obj, null, 2), // null & 2 for pretty-formatted JSON
            deserialize: (str) => JSON.parse(str),
        },
        // We will use `messages` array in our database to store user messages using exported lowdb instance from LocalSession via Telegraf Context
        state: { messages: [] }
    })

    // Wait for database async initialization finished (storageFileAsync or your own asynchronous storage adapter)
    localSession.DB.then(DB => {
        // Database now initialized, so now you can retrieve anything you want from it
        console.log('Current LocalSession DB:', DB.value())
        // console.log(DB.get('sessions').getById('1:1').value())
    })

    // Telegraf will use `telegraf-session-local` configured above middleware
    bot.use(localSession.middleware())


    bot.start((ctx) => {


        // Проверяем, начинается ли сообщение с /start
        if (ctx.message.text.startsWith('/start')) {
            // Извлекаем параметр после /start
            const match = ctx.message.text.match(/^\/start ([\w-]+)$/);
            console.log(match)
            if (match) {
                // Удаляем /start из начала строки
                const command = match[1].replace('/start', '');
                console.log(`start: ${command}`)
                // Разделяем строку на части по дефису
                const parts = command.split(/-(.*)/);
                const token = parts[0]; // Первая часть - токен
                const sessionId = parts[1]; // Вторая часть - sessionId
                console.log(`start: ${token}`)
                console.log(`start: ${sessionId}`)
                // Здесь вы можете использовать token и sessionId для дальнейших действий
                if (token) {
                    ctx.session.token = token; // Сохраняем токен в сессию
                    ctx.session.sessionId = sessionId;
                    ctx.reply('Добро пожаловать в бота Чтобы зарегистрироваться отправьте номер вашего телефона, нажав на кнопку ниже:',
                        {
                            reply_markup: {
                                keyboard: [
                                    [{ text: 'Поделиться контактом', request_contact: true }]
                                ],
                                resize_keyboard: true,
                                one_time_keyboard: true
                            }
                        });
                } else {
                    ctx.reply('Пожалуйста, используйте QR - код или ссылку из приложения!');
                }
            }
            else {
                console.log("Команда /start не соответствует ожидаемому формату");
            }
        }

    });



    bot.on('contact', async (ctx) => {
        const phoneNumber = formatPhoneNumber(ctx.message.contact.phone_number);
        const telegramId = ctx.message.contact.user_id;
        const token = ctx.session.token;
        const sessionId = ctx.session.sessionId
        
        console.log(`contact: ${token}`)
        console.log(`contact: ${sessionId}`)
        if (token) {
            const response = await fetch(`${apiRoot}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({sessionId: sessionId, token: token, phone: phoneNumber, id: telegramId }),
            }).then(response => {
                if (response.status === 404) {
                    ctx.reply('Такого номера нет');
                }
                else if(response.status === 500 || response.status === 401) {
                    ctx.reply('Что-то пошло не так!');
                }
                 else {
                    ctx.reply('Вход успешен!');;
                }
            });
            ctx.session = null;
        }
        else {
            ctx.reply('Пожалуйста, используйте QR - код или ссылку из приложения!');
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
