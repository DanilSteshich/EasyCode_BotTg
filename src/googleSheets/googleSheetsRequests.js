const logAction = require("../logs/addTextLog");
const { google } = require("googleapis");
const dotenv = require('dotenv').config()

class GoogleRequests {
    constructor(sheetName) {
        this.sheetName = sheetName;
    }

    async pullTeacher() {

        logAction(`Запрос на получение данных о преподавателях из гугл таблицы`);

        const pullTeacher = async () => {
            try {
                // Аутентификация
                const auth = new google.auth.GoogleAuth({
                    keyFile: "src/googleSheets/googleFile.json", // Путь к ключу сервисного аккаунта
                    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
                });
                // Создание клиента для доступа к Google Sheets API
                const sheets = google.sheets({ version: "v4", auth });

                // Идентификатор таблицы
                const spreadsheetId = process.env.TABLE_ID; // Идентификатор таблицы
                // Выполняем запрос на получение данных
                const response = await sheets.spreadsheets.values.get({
                    spreadsheetId,
                    range: `${this.sheetName}!A3:AB`, // Диапазон столбцов, которые нужно получить
                });

                const values = response.data.values || [];
                logAction(`Данные из гугл таблицы успешно получены`);

                return values;
            } catch (error) {
                logAction(`ОШИБКА при получении данных из таблицы ${error}`);
                throw error;
            }
        };
        try {
            return await pullTeacher();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = GoogleRequests;