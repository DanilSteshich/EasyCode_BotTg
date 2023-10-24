const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logAction = require("../logs/addTextLog");

class Database {
    constructor() {
        this.dbPath = path.resolve(__dirname, './teachers.sqlite3');
    }

    deleteAllData(table) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    logAction(`ОШИБКА при подключении к базе данных: ${err.message}`);
                    reject(err);
                } else {
                    logAction('Подключение к базе данных успешно установлено.');

                    const sqlQuery = `DELETE FROM ${table}`;

                    db.run(sqlQuery, function (err) {
                        if (err) {
                            logAction(`ОШИБКА при удалении данных: ${err.message}`);
                            reject(err);
                        } else {
                            logAction('Все данные успешно удалены.');
                            resolve();
                        }
                    });

                    db.close((err) => {
                        if (err) {
                            logAction(`ОШИБКА при закрытии базы данных: ${err.message}`);
                            reject(err);
                        } else {
                            logAction('Соединение с базой данных успешно закрыто.');
                        }
                    });
                }
            });
        });
    };

    insertDataTeacherTable(arr) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    logAction(`ОШИБКА при подключении к базе данных: ${err.message}`);
                    reject(err);
                } else {
                    logAction('Подключение к базе данных успешно установлено.');

                    const sqlQuery = `INSERT INTO teachers (name, email, username_tg, phone_number, crm_id, login_crm, password_crm, chat_id, id_and_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                    arr.forEach((row) => {
                        // Применяем метод trim() к каждому полю перед вставкой
                        const fromGoogle = [
                            row[1] ? row[1].trim() : "", // name
                            row[3] ? row[3].trim() : "", // mail
                            row[4] ? row[4].trim() : "", // username tg
                            row[5] ? row[5].trim() : "", // phone number
                            row[0] ? row[0].trim() : "", // id crm
                            row[7] ? row[7].trim() : "", // login crm
                            row[8] ? row[8].trim() : "", // pass crm
                            row[18] ? row[18].trim() : "", // chat id
                            row[11] ? row[11].trim() : "" // id & name
                        ];

                        db.run(sqlQuery, fromGoogle, function (err) {
                            if (err) {
                                logAction(`ОШИБКА при добавлении данных: ${err.message}`);
                                reject(err);
                            } else {
                                logAction(`Данные успешно добавлены. ID: ${this.lastID}`);
                            }
                        });
                    });

                    db.close((err) => {
                        if (err) {
                            logAction(`ОШИБКА при закрытии базы данных: ${err.message}`);
                            reject(err);
                        } else {
                            logAction('Соединение с базой данных успешно закрыто.');
                            resolve();
                        }
                    });
                }
            });
        });
    };

    getChatIdByCrmId(crm_id) {
        return new Promise((resolve, reject) => {
          const db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
              logAction(`ОШИБКА при подключении к базе данных: ${err.message}`);
              reject(err);
            } else {
              logAction('Подключение к базе данных успешно установлено.');
    
              const sql = `SELECT chat_id FROM teachers WHERE crm_id = ?`; //  - название таблицы
              logAction(`Поиск chatid по crm id:${crm_id}`);
              db.get(sql, [crm_id], function (err, row) {
                if (err) {
                  logAction(`ОШИБКА при выполнении запроса: ${err.message}`);
                  reject(err);
                } else {
                  if (row) {
                    logAction(`Данные найдены: ${row.chat_id}`);
                    resolve(row.chat_id);
                  } else {
                    logAction(`ОШИБКА: Данные не найдены: ${row}`);
                    resolve(null); // Пользователь с таким именем не найден
                  }
                }
              });
    
              db.close((err) => {
                if (err) {
                  logAction(`ОШИБКА при закрытии базы данных: ${err.message}`);
                  reject(err);
                } else {
                  logAction('Соединение с базой данных успешно закрыто.');
                }
              });
            }
          });
        });
    };


}

module.exports = Database;