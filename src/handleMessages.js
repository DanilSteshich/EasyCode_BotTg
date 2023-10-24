const logAction = require("./logs/addTextLog");
const GoogleRequests = require("../src/googleSheets/googleSheetsRequests");
const Database = require("../src/db/dbQuerys");
const getAllLessonsJson = require("../src/crm/getLessons");
const extractIdFromUrl = require("../src/googleSheets/googleTableId");
const db = new Database()

class Message {
    constructor(chatId, text, from) {
        this.chatId = chatId;
        this.text = text;
        this.from = from;
    }
    async handle(bot) {
        if (this.text === "/admin" && this.chatId == 5193652508) {
            logAction(`запрос /admin от ${this.from}`);

            const startMessage = "Обработка запроса...";

            const options = {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ["Обновить таблицу преподавателей", 'Записать уроки на сегодня в базу данных'],
                        ["Начать напоминание об уроках", 'Закончить']
                    ],
                    resize_keyboard: true,
                }),
            };

            this.sendKey(bot, startMessage, options);
        }

        if (this.chatId == 5193652508 && this.text == "Начать напоминание об уроках") {
            logAction(`запрос "Начать напоминание об уроках" от ${this.from}`);

            const { lessons, count } = await getAllLessonsJson(process.env.CRM_DATA_URL, 0);

            let page = 150;
            while (lessons.length < count) {
                let second = await getAllLessonsJson(process.env.CRM_DATA_URL, page);
                lessons.push(...second.lessons);
                page += 150;
            }

            for (const lesson of lessons) {
                const chatId = await db.getChatIdByCrmId(lesson.teacher_id);
                if (chatId) {
                    try {                        // Отправьте сообщение с информацией о уроке
                        await bot.sendMessage(
                            chatId,
                            `ID группы: <code>${lesson.id}</code>\nДата и время: <code>${lesson.date_start}</code>\nНазвание группы: ${lesson.name}`,
                            { parse_mode: "HTML" }
                        );
                        logAction(`Напоминание об уроке отправлено в чат ${chatId}`);
                    } catch (err) {
                        logAction(`ОШИБКА: Напоминание об уроке не отправлено в чат ${chatId}, id урока: ${lesson.id}, ошибка: ${err}`);
                    }
                }
                
                sleep(3000);
            }

            this.sendResponse(bot, 'Напоминания отправленный')
        }

        if (this.chatId == 5193652508 && this.text == "Обновить таблицу преподавателей") {
            logAction(`запрос /updateTableTeacher от ${this.from}`);

            const googleRequests = new GoogleRequests("Преподаватели");
            const teachersTable = await googleRequests.pullTeacher();

            await db.deleteAllData('teachers') // удаляем все данные из таблицы преподов
            await db.insertDataTeacherTable(teachersTable)
                .then((res) => {
                    logAction('Таблица успешно обновлена');
                    this.sendResponse(bot, "Таблица успешно обновлена")
                })
                .catch((error) => {
                    logAction(`Ошибка обновления таблицы преподавателей ${error}`);
                    this.sendResponse(bot, "Таблица успешно обновлена")
                })

        }

        switch (this.text) {
            case "Обновить таблицу преподавателей":

                break;

            case 'Форматирова ОС':

                // logAction(`запрос /форматировать таблицу ОС от ${this.from}`);

                // const googleRequests = new GoogleRequests("Для преподавателей");
                // const texts = await googleRequests.pullComments();

                // await spellCheck(texts)
                //   .then(async (correctedTexts) => {
                //     await googleRequests
                //       .clearColumn()
                //       .then(async () => await googleRequests.insertValues(correctedTexts))
                //       .then(() => {
                //         logAction("Новые данные ОС успешно вставлены");
                //         this.sendResponse(bot, "Таблица ОС успешно отформатированна");
                //       })
                //       .catch((error) => {
                //         logAction("Ошибка при вставке новых данных ОС:", error);
                //         this.sendResponse(bot, "Ошибка форматирования");
                //       });
                //   })
                //   .catch((error) => {
                //     logAction(`Произошла ошибка при форматировании данных ОС: ${error}`);
                //     this.sendResponse(bot, "Ошибка форматирования");
                //   });
                break;


            case "Закончить":
                this.hideOptions(bot, "Работа закончена \n\n Нажми для повторного запуска – /admin");
                break;

            case "/get_id@notifications_lessons_bot":
                bot.sendMessage(this.chatId, `ID чата: <code>${this.chatId}</code>`, { parse_mode: "HTML" })
                break;
        }

    }

    sendResponse(bot, response) {
        bot.sendMessage(this.chatId, response);

        logAction(`Бот отравил сообщение: '${response}' ${this.from} `);
    }

    sendKey(bot, message, options) {
        bot.sendMessage(this.chatId, message, options);
    }

    hideOptions(bot, message) {
        const hideOptions = {
            reply_markup: JSON.stringify({
                remove_keyboard: true,
            }),
        };

        bot.sendMessage(this.chatId, message, hideOptions);
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

module.exports = Message;