const fs = require("fs");

// Функция для записи действия в лог-файл
const logAction = (action) => {
    const logEntry = `[${new Date().toLocaleString()}] ${action}\n`;

    try {
        fs.appendFileSync("./bot.log", logEntry);
    } catch (error) {
        console.error("Ошибка при записи в лог-файл:", error);
    }
};
module.exports = logAction;