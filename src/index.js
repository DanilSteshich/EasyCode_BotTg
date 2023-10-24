const TelegramBot = require("node-telegram-bot-api");
const dotenv = require('dotenv').config()
const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const logAction = require("./logs/addTextLog.js");
const Message = require("../src/handleMessages")
// const EventEmitter = require("events");

// Установка нового лимита для количества слушателей
// EventEmitter.defaultMaxListeners = 15; // Здесь вы можете установить другое значение

const startBot = async () => {
    bot.on("message", async (msg) => {
        try {
            const chatId = msg.chat.id;
            const text = msg.text;
            const from = msg.from.username;

            //Добавление записи в лог
            logAction(`Пришло сообщение ${text} от ${from} (chatId: ${chatId})`);

            // Создание объекта Message
            const message = new Message(chatId, text, from);

            // Отправка объекта Message для обработки
            await message.handle(bot);
        } catch (error) {
            logAction(`Ошибка в работе бота: ${error}`);
            console.error("ФАТАЛЬНАЯ Ошибка в работе бота, чекай лог", error);
        }
    });

    // Функция для вывода ошибок в работе бота
    const logError = (error) => {
        logAction(`Ошибка в работе бота: ${error}`);
        console.error("Ошибка в работе бота, чекай лог", error);
    };

    // Подключение обработчика ошибок
    bot.on("polling_error", logError);
};

// Запуск бота
try {
    startBot();
    logAction(`Бот успешно запущен`);
    console.log(`Bot started`);
} catch (error) {
    logAction(`ОШИБКА Бот завершил работу с ошибкой ${error}`);
    console.log("Bot fineshed");
}