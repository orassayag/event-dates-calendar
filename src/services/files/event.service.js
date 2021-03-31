const culture = require('../../culture/culture');
const { CalendarDay, EventDate } = require('../../core/models');
const { EventType } = require('../../core/enums');
const applicationService = require('./application.service');
const pathService = require('./path.service');
const { fileUtils, pathUtils, timeUtils } = require('../../utils');

class EventService {

    constructor() {
/*          */
        this.dailyTasks = [];
        this.linesList = [];
        this.calendarDaysList = [];
/*         this.eventStaticDates = [];
        this.eventCalendarDates = [];
        this.eventSourceDates = []; */
    }

    async getEvents() {
        // First, get all the events from the online calendar.
       const eventCalendarDates = await this.getCalendarEvents();
        // Second, get all the events from static JSON file.
        await this.getStaticEvents();
        // Third, get all the events from the source event dates TXT file.
        await this.getSourceEvents();

        this.createCalendarDays();
    }

    createCalendarDays() {
        // Create the calendar days list array.
        const date = new Date(applicationService.applicationData.year, 0, 1);
        const end = new Date(date);
        end.setFullYear(end.getFullYear() + 1);
        while (date < end || this.calendarDaysList.length < 365) {
            const { englishDay, hebrewDay } = timeUtils.getDayInWeek(date);
            this.calendarDaysList.push(new CalendarDay({
                id: this.calendarDaysList.length + 1,
                date: date,
                displayDate: timeUtils.getDisplayDate(date),
                dayInWeek: englishDay,
                displayDayInWeek: hebrewDay
            }));
            date.setDate(date.getDate() + 1);
        }
    }

    async createCalendarEvents() {

    }

    async createStaticEvents() {

    }

    async createSourceEvents() {
        let lineReader = null;
        const eventType = EventType.INITIATE;
        await new Promise(async (resolve, reject) => {
            if (reject) { }
            // Validate the source event dates TXT file and get the stream.
            await this.validateSourceFile({
                filePath: pathService.pathData.sourcePath,
                parameterName: 'SOURCE_PATH'
            });
            // Scan the source event dates TXT file.
            lineReader = fileUtils.getFileLinesFromStream(pathService.pathData.sourcePath);
            lineReader.on('line', (line) => this.handleLine({
                lineReader: lineReader,
                line: line,
                eventType: eventType
            }));
            lineReader.on('close', () => { resolve(); });
        });
    }

    validateEventType(data) {
        const { line } = data;
        let { eventType } = data;
        if (!line) {
            return;
        }
        if (line[0] === '=') {
            switch (this.eventType) {
                case EventType.INITIATE: eventType = EventType.SERVICE; break;
                case EventType.SERVICE: eventType = EventType.BIRTHDAY; break;
                case EventType.BIRTHDAY: eventType = EventType.DATA; break;
                case EventType.DAILY_TASK: eventType = null; break;
            }
        }
        else if (line === '!@#$%') {
            eventType = EventType.DAILY_TASK;
        }
        return eventType;
    }

    handleLine(data) {
        const { lineReader, line } = data;
        // Check if to add the line to the lines list, in order to include them in the new TXT file.
        const eventType = this.validateEventType(data);
        this.linesList.push(line);
        switch (eventType) {
            case EventType.SERVICE:
            case EventType.BIRTHDAY:
                this.createSourceEvent(line);
                break;
            case EventType.DAILY_TASK:
                this.createDailyTask(line);
                break;
            default:
                // When there is no event type, the readline process is no longer necessary - Close it.
                lineReader.close();
                break;
        }
    }

    createSourceEvent(line) {
        // Check if the line include a date. If so, it's a service / birthday / calendar event.
        const date = timeUtils.getDatePartsFromText(line);
        if (!date) {
            return;
        }
        const dateParts = date.split('/');
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const year = typeof dateParts[2] !== 'undefined' ? parseInt(dateParts[2]) : null;
        this.eventDatesList.push(new EventDate({
            id: this.eventDatesList.length + 1,
            day: day,
            month: month,
            year: year,
            eventType: this.eventType,
            text: this.getEventText({
                date: date,
                birthYear: year,
                line: line
            })
        }));
    }

    createDailyTask(line) {
        this.dailyTasks.push(line);
    }

    // If the event is of 'birthday' type, replace the birthdate with the future age.
    getEventText(data) {
        const { date, birthYear, line } = data;
        let result = line;
        if (this.eventType === EventType.BIRTHDAY) {
            const age = result.replace(date, `(${timeUtils.getAge({
                year: applicationService.applicationData.year,
                birthYear: birthYear
            })})`);
            result = `${culture.hebrewBirthDay}${age}-`;
        }
        return result;
    }

    async validateSourceFile(data) {
        const { filePath, parameterName } = data;
        if (!await fileUtils.isPathExists(filePath)) {
            throw new Error(`Invalid or no ${parameterName} parameter was found: Expected a number but received: ${filePath} (1000010)`);
        }
        if (!fileUtils.isFilePath(filePath)) {
            throw new Error(`The parameter path ${parameterName} marked as file but it's a path of a directory: ${filePath} (1000011)`);
        }
        const extension = pathUtils.getExtname(filePath);
        if (extension !== '.txt') {
            throw new Error(`The parameter path ${parameterName} must be a TXT file but it's: ${extension} file (1000012)`);
        }
    }
}

module.exports = new EventService();
        // Convert to eventSourceDates, eventCalendarDates, eventStaticDates.
/* const applicationService = require('./application.service');
const { EventDate } = require('../../core/models');
const { timeUtils } = require('../../utils');

class CalendarService {

    constructor() {
        this.eventDates = [];
    }

    createCalendar() {
        // Create the dates list array.
        const date = new Date(applicationService.applicationData.year, 0, 1);
        const end = new Date(date);
        end.setFullYear(end.getFullYear() + 1);
        while (date < end || this.eventDates.length < 365) {
            const { englishDay, hebrewDay } = timeUtils.getDayInWeek(date);
            this.eventDates.push(new EventDate({
                id: this.eventDates.length + 1,
                date: date,
                displayDate: timeUtils.getDisplayDate(date),
                dayInWeek: englishDay,
                displayDayInWeek: hebrewDay
            }));
            date.setDate(date.getDate() + 1);
        }
    }
}

module.exports = new CalendarService(); */
/*         debugger; */
/*             getDayInWeek(date) {
                if (!validationUtils.isValidDate(date)) {
                    return null;
                }
                const day = date.getDay();
                return {
                    englishDay: this.englishDaysList[day],
                    hebrewDay: this.hebrewDaysList[day]
                };
            } */
            /*         debugger; */
            /*             this.eventType = null; */
/*         if (this.eventType) {
        } */
/*         debugger; */
        //debugger;
/*         lineReader.on('close', () => {
            debugger;
        }); */
/*         debugger; */
/*         debugger; */
/*             debugger; */
/* , validationUtils */
/* , LineType  */
/*         this.isAddLine = true; */
        //this.eventType = LineType.DATA;
/*         console.log(date); */
/*         if (this.eventType === LineType.DATA) {
this.linesList.push(line);
} */
/*         if (this.isAddLine) {
    this.linesList.push(line);
} */
/*             const EventType = enumUtils.createEnum([
        ['SERVICE', 'service'],
        ['BIRTHDAY', 'birthday'],
        ['CALENDAR', 'calendar'],
        ['DATA', 'data']
    ]); */