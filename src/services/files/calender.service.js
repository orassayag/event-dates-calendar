const applicationService = require('./application.service');

class CalendarService {

    constructor() {
        this.eventDates = [];
    }

    createCalendar() {
        // Create the dates list array.
        const date = new Date(applicationService.applicationData.year, 0, 1);
        const end = new Date(date);
        end.setFullYear(end.getFullYear() + 1);
        while (date < end || this.eventDates.length >= 365) {
            this.eventDates.push(date);
            date.setDate(date.getDate() + 1);
        }
    }
}

module.exports = new CalendarService();