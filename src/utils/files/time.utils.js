const textUtils = require('./text.utils');
const regexUtils = require('./regex.utils');
const validationUtils = require('./validation.utils');

class TimeUtils {

    constructor() { }
    
    getDisplayDate(date) {
        if (!validationUtils.isValidDate(date)) {
            return null;
        }
        return `${[this.getDay(date), this.getMonth(date), this.getYear(date)].join('/')}`;
    }

    getFullDateNoSpaces() {
        const date = new Date();
        return `${[this.getDay(date), this.getMonth(date), this.getYear(date)].join('')}_${[this.getHours(date), this.getMinutes(date), this.getSeconds(date)].join('')}`;
    }

    getDateNoSpaces() {
        const date = new Date();
        return [this.getDay(date), this.getMonth(date), this.getYear(date)].join('');
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

    /*

        getDifferenceTimeBetweenDates(data) {
            const { startDateTime, endDateTime } = data;
            if (!validationUtils.isValidDate(startDateTime) || !validationUtils.isValidDate(endDateTime)) {
                return null;
            }
            // Get the total time.
            const totalTime = textUtils.getPositiveNumber(endDateTime - startDateTime);
            // Get total seconds between the times.
            let delta = totalTime / 1000;
            // Calculate (and subtract) whole days.
            const days = textUtils.getFloorPositiveNumber(delta / 86400);
            delta -= days * 86400;
            // Calculate (and subtract) whole hours.
            const hours = textUtils.getFloorPositiveNumber((delta / 3600) % 24);
            delta -= hours * 3600;
            // Calculate (and subtract) whole minutes.
            const minutes = textUtils.getFloorPositiveNumber((delta / 60) % 60);
            delta -= minutes * 60;
            // What's left is seconds.
            // In theory the modulus is not required.
            const seconds = textUtils.getFloorPositiveNumber(delta % 60);
            return `${days}.${hours}:${minutes}:${seconds}`;
        } */
}

module.exports = new TimeUtils();
/*         //date = date ? date[0].trim() : null;
        //console.log(date.length);
        //return date ? date[0].split('/') : null; */
        //console.log(date);