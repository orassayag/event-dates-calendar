const textUtils = require('./text.utils');
const regexUtils = require('./regex.utils');
const validationUtils = require('./validation.utils');

class TimeUtils {

    constructor() {
        this.daysInYear = 365;
    }

    getCurrentDate(value) {
        return value ? validationUtils.isValidArray(value) ? new Date(...value) : new Date(value) : new Date();
    }

    getDisplayDate(date) {
        if (!validationUtils.isValidDate(date)) {
            return null;
        }
        return `${[this.getDay(date), this.getMonth(date), this.getYear(date)].join('/')}`;
    }

    getFullDateNoSpaces() {
        const date = this.getCurrentDate();
        return `${[this.getDay(date), this.getMonth(date), this.getYear(date)].join('')}_${[this.getHours(date), this.getMinutes(date), this.getSeconds(date)].join('')}`;
    }

    getDateNoSpaces() {
        const date = this.getCurrentDate();
        return [this.getDay(date), this.getMonth(date), this.getYear(date)].join('');
    }

    getDateParts(date) {
        if (!validationUtils.isValidDate(date)) {
            return null;
        }
        return {
            dateDay: date.getDate(),
            dateMonth: date.getMonth() + 1,
            dateYear: date.getFullYear()
        };
    }

    getSeconds(date) {
        return textUtils.addLeadingZero(date.getSeconds());
    }

    getMinutes(date) {
        return textUtils.addLeadingZero(date.getMinutes());
    }

    getHours(date) {
        return textUtils.addLeadingZero(date.getHours());
    }

    getDay(date) {
        return textUtils.addLeadingZero(date.getDate());
    }

    getMonth(date) {
        return textUtils.addLeadingZero(date.getMonth() + 1);
    }

    getYear(date) {
        return date.getFullYear();
    }

    getDatePartsFromText(text) {
        if (!text) {
            return null;
        }
        let result = null;
        const date = text.match(regexUtils.findDateRegex);
        if (date) {
            result = date[0].trim();
            result = result.length > 0 ? result : null;
        }
        return result;
    }

    getAge(data) {
        const { year, birthYear } = data;
        if (!year || !birthYear) {
            return '?';
        }
        return Math.abs(year - birthYear);
    }
}

module.exports = new TimeUtils();