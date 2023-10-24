const logAction = require("../logs/addTextLog");

const extractIdFromUrl = (url) => {
    const startDelimiter = 'd/';
    const endDelimiter = '/e';

    const startIndex = url.indexOf(startDelimiter);
    const endIndex = url.indexOf(endDelimiter);

    if (startIndex !== -1 && endIndex !== -1) {
        logAction('id гугл таблицы успешно преобразован')
        return url.substring(startIndex + startDelimiter.length, endIndex);
    } else {
        logAction('ОШИБКА id гугл таблицы не преобразован')
        return null;
    }
}

module.exports = extractIdFromUrl;