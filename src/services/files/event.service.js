const { dictionaryCulture, eventCulture } = require('../../culture');
const { CalendarDay, EventDate, SourceEventResult } = require('../../core/models');
const { EventType } = require('../../core/enums');
const applicationService = require('./application.service');
const logService = require('./log.service');
const pathService = require('./path.service');
const { domUtils, eventUtils, fileUtils, pathUtils, timeUtils,
    validationUtils } = require('../../utils');

class EventService {

    constructor() {
        this.lastEventId = 0;
        this.eventTypeSeperator = '=';
        this.completeCancelTasksSeperator = '#@';
        this.dailyTasksSeperator = '!@';
    }

    async createEventDates() {
        // First, get all the events from the online calendar website.
        const calendarEventDates = await this.createCalendarEventDates();
        // Second, complete the missing events from the calendar website.
        const missingCalendarEventDates = this.createMissingCalendarEventDates(calendarEventDates);
        // Third, get all the static events from a event culture file.
        const staticEventDates = this.createStaticEventDates();
        // Next, get all the events from the source event dates TXT file.
        const { sourceEventDates, dataLines, dailyTasks } = await this.createSourceEventDates();
        // Next, create the calendar days to log.
        const calendarDaysList = this.createCalendarDays([...calendarEventDates, ...missingCalendarEventDates,
        ...staticEventDates, ...sourceEventDates]);
        // Finally, log all the days into a new TXT file in the 'dist' directory.
        await logService.logEventDates({
            calendarDaysList: calendarDaysList,
            dataLines: dataLines,
            dailyTasks: dailyTasks
        });
    }

    createEventDate(data) {
        const { day, month, year, eventType, text } = data;
        this.lastEventId++;
        return new EventDate({
            id: this.lastEventId,
            day: day,
            month: month,
            year: year,
            eventType: eventType,
            text: text
        });
    }

    async createCalendarEventDates() {
        const calendarEventDates = [];
        const dom = await domUtils.getDOMfromURL(applicationService.applicationData.calendarLink);
        const daysList = dom.window.document.getElementsByClassName('dayInMonth');
        for (let i = 0; i < daysList.length; i++) {
            const dayDOM = daysList[i];
            if (!dayDOM.textContent.trim()) {
                continue;
            }
            const spansDOMList = dayDOM.getElementsByTagName('span');
            if (spansDOMList.length > 1) {
                // Example of day Id: id20211214.
                const dayIdDOM = dayDOM.getElementsByClassName('personal')[0].getAttribute('id');
                const day = parseInt(`${dayIdDOM[8]}${dayIdDOM[9]}`);
                const month = parseInt(`${dayIdDOM[6]}${dayIdDOM[7]}`);
                const year = parseInt(`${dayIdDOM[2]}${dayIdDOM[3]}${dayIdDOM[4]}${dayIdDOM[5]}`);
                for (let y = 1; y < spansDOMList.length; y++) {
                    calendarEventDates.push(this.createEventDate({
                        day: day,
                        month: month,
                        year: year,
                        eventType: EventType.CALENDAR,
                        text: eventUtils.createEventTemplate(spansDOMList[y].textContent)
                    }));
                }
            }
        }
        return calendarEventDates;
    }

    createMissingCalendarEventDates(calendarEventDates) {
        const missingCalendarEventDates = eventCulture.createMissingEventDates();
        const resultMissingCalendarEventDates = [];
        for (let i = 0; i < missingCalendarEventDates.length; i++) {
            const { includeText, excludeText, displayText, isDayBefore } = missingCalendarEventDates[i];
            const calendarEventDate = calendarEventDates.find(e => {
                return e.text.indexOf(includeText) > -1 && e.text.indexOf(excludeText ? excludeText : '^') === -1;
            });
            if (calendarEventDate) {
                const { day, month, year, text } = calendarEventDate;
                resultMissingCalendarEventDates.push(this.createEventDate({
                    day: isDayBefore ? day - 1 : day,
                    month: month,
                    year: year,
                    eventType: EventType.CALENDAR,
                    text: displayText ? eventUtils.createEventTemplate(displayText) :
                        eventUtils.completeEventTemplate(dictionaryCulture.eveNight, text)
                }));
            }
        }
        return resultMissingCalendarEventDates;
    }

    createStaticEventDates() {
        const staticEventDates = eventCulture.createStaticEventDates();
        const resultStaticEventDates = [];
        for (let i = 0; i < staticEventDates.length; i++) {
            const { day, month, year, eventType, text } = staticEventDates[i];
            resultStaticEventDates.push(this.createEventDate({
                day: day,
                month: month,
                year: year,
                eventType: eventType,
                text: eventUtils.createEventTemplate(text)
            }));
        }
        return resultStaticEventDates;
    }

    async createSourceEventDates() {
        let lineReader = null;
        let eventType = EventType.INITIATE;
        return await new Promise(async (resolve, reject) => {
            const sourceEventResult = new SourceEventResult();
            if (reject) { }
            // Validate the source event dates TXT file and get the stream.
            await this.validateSourceFile({
                filePath: pathService.pathData.sourcePath,
                parameterName: 'SOURCE_PATH'
            });
            // Scan the source event dates TXT file.
            lineReader = fileUtils.getFileLinesFromStream(pathService.pathData.sourcePath);
            lineReader.on('line', (line) => {
                const handleLineResult = this.handleLine({
                    lineReader: lineReader,
                    line: line,
                    eventType: eventType
                });
                if (!handleLineResult) {
                    return;
                }
                if (handleLineResult.returnValue) {
                    switch (handleLineResult.eventType) {
                        case EventType.SERVICE:
                        case EventType.BIRTHDAY:
                            sourceEventResult.sourceEventDates.push(handleLineResult.returnValue);
                            break;
                        case EventType.DAILY_TASK:
                            if (!handleLineResult.isSymbole) {
                                sourceEventResult.dailyTasks.push(handleLineResult.returnValue);
                            }
                            break;
                    }
                }
                eventType = handleLineResult.eventType;
                if (handleLineResult.line && eventType && (handleLineResult.isSymbole ||
                    eventType !== EventType.COMPLETE_CANCEL_TASK)) {
                    sourceEventResult.dataLines.push(handleLineResult.line);
                }
            });
            lineReader.on('close', () => {
                sourceEventResult.dailyTasks.splice(-1, 1);
                resolve(sourceEventResult);
            });
        });
    }

    validateSourceEventType(data) {
        const { line } = data;
        let { eventType } = data;
        let isBreakLine, isSymbole = false;
        if (!line) {
            isBreakLine = true;
            return {
                eventType: eventType,
                isBreakLine: isBreakLine,
                isSymbole: isSymbole
            };
        }
        if (eventType === EventType.END) {
            return null;
        }
        if (line[0] === this.eventTypeSeperator) {
            isBreakLine = true;
            switch (eventType) {
                case EventType.INITIATE: eventType = EventType.SERVICE; break;
                case EventType.SERVICE: eventType = EventType.BIRTHDAY; break;
                case EventType.BIRTHDAY: eventType = EventType.DATA; break;
                case EventType.DAILY_TASK: eventType = EventType.END; isSymbole = true; break;
            }
        }
        else if (line === this.completeCancelTasksSeperator) {
            isBreakLine = true;
            isSymbole = true;
            eventType = EventType.COMPLETE_CANCEL_TASK;
        }
        else if (line === this.dailyTasksSeperator) {
            isBreakLine = true;
            isSymbole = true;
            eventType = EventType.DAILY_TASK;
        }
        return {
            eventType: eventType,
            isBreakLine: isBreakLine,
            isSymbole: isSymbole
        };
    }

    handleLine(data) {
        let returnValue = null;
        let { line } = data;
        const { lineReader } = data;
        // Check if to add the line to the lines list, in order to include them in the new TXT file.
        const validateEventResult = this.validateSourceEventType(data);
        // When there is no event type result, the readline process is no longer necessary - Close it.
        if (!validateEventResult) {
            lineReader.close();
            return null;
        }
        const { eventType, isBreakLine, isSymbole } = validateEventResult;
        line = isBreakLine ? `${line}\r` : line;
        switch (eventType) {
            case EventType.SERVICE:
            case EventType.BIRTHDAY:
                returnValue = this.createSourceEvent({
                    line: line,
                    eventType: eventType
                });
                break;
            case EventType.COMPLETE_CANCEL_TASK:
                line = isSymbole ? `${line}\n` : line;
                break;
            case EventType.DAILY_TASK:
                returnValue = line;
                break;
            case EventType.END:
                if (!isSymbole) {
                    line = null;
                }
                break;
        }
        return {
            eventType: eventType,
            line: line,
            returnValue: returnValue,
            isSymbole: isSymbole
        };
    }

    createSourceEvent(data) {
        const { line, eventType } = data;
        // Check if the line include a date. If so, it's a service / birthday event.
        const date = timeUtils.getDatePartsFromText(line);
        if (!date) {
            return;
        }
        const dateParts = date.split('/');
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const year = typeof dateParts[2] !== 'undefined' ? parseInt(dateParts[2]) : null;
        if (eventType === EventType.SERVICE && year !== applicationService.applicationData.year) {
            return;
        }
        return this.createEventDate({
            day: day,
            month: month,
            year: year,
            eventType: eventType,
            text: this.createSourceEventText({
                date: date,
                birthYear: year,
                line: line,
                eventType: eventType
            })
        });
    }

    // If the event is of 'birthday' type, replace the birthdate with the future age.
    createSourceEventText(data) {
        const { date, birthYear, line, eventType } = data;
        let result = line;
        if (eventType === EventType.BIRTHDAY) {
            const age = result.replace(date, `(${timeUtils.getAge({
                year: applicationService.applicationData.year,
                birthYear: birthYear
            })})`);
            result = eventUtils.birthDayEventTemplate(dictionaryCulture.hebrewBirthDay, age);
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

    createCalendarDays(allEvents) {
        const calendarDaysList = [];
        // Create the calendar days list array.
        const date = new Date(applicationService.applicationData.year, 0, 1);
        const end = new Date(date);
        end.setFullYear(end.getFullYear() + 1);
        while (date < end || calendarDaysList.length < 365) {
            const { englishDay, hebrewDay } = this.getDayInWeek(date);
            calendarDaysList.push(new CalendarDay({
                id: calendarDaysList.length + 1,
                date: date,
                displayDate: timeUtils.getDisplayDate(date),
                dayInWeek: englishDay,
                displayDayInWeek: hebrewDay,
                eventDatesList: allEvents.filter(e => {
                    return e.day === date.getDate() && e.month === date.getMonth() + 1;
                })
            }));
            date.setDate(date.getDate() + 1);
        }
        calendarDaysList.reverse();
        return calendarDaysList;
    }

    getDayInWeek(date) {
        if (!validationUtils.isValidDate(date)) {
            return null;
        }
        const day = date.getDay();
        return {
            englishDay: dictionaryCulture.englishDaysList[day],
            hebrewDay: dictionaryCulture.hebrewDaysList[day]
        };
    }
}

module.exports = new EventService();
            //debugger;
/*             isBreakLine = true;
return {
eventType: eventType,
isBreakLine: isBreakLine,
isSymbole: isSymbole
}; */
/*         if (eventType === EventType.END)
        {

        } */
/*                 case EventType.END: eventType = null; break; */

/*             default:
            // When there is no event type, the readline process is no longer necessary - Close it.
            lineReader.close();
            break; */
/*                     if (handleLineResult.isSymbole)
                    {
                        debugger;
                    } */
/*  break; */
/*                 case EventType.COMPLETE_CANCEL_TASK: break; */
/*         this.completeCancelTasksSeperator = '#@';
        this.dailyTasksSeperator = '!@'; */
/*         debugger; */
/*     this.eventTypeSeperator = '=';
this.dailyTasksSeperator = '!@#$%'; */
/*                     debugger; */
        //const sourceEventResult = await this.createSourceEventDates();
/*         debugger; */
/*         const calendarDaysList = this.createCalendarDays({
    calendarEventDates: calendarEventDates,
    missingCalendarEventDates: missingCalendarEventDates,
    staticEventDates: staticEventDates,
    sourceEventResult: sourceEventResult
}); */
        //const sourceEventDates = [];
        //this.createEvent
/*         const resultStaticEventDates = [];
        for (let i = 0; i < staticEventDates.length; i++) {
            const {  } = staticEventDates[i];
            resultMissingCalendarEventDates.push(this.createEvent({
                day: isDayBefore ? day - 1 : day,
                month: month,
                year: year,
                eventType: EventType.CALENDAR,
                text: `-${displayText ? displayText : `${dictionaryCulture.eveNight} ${text}`}`
            }));
        }
        return resultStaticEventDates; */
/*         this.linesList.push(line); */
    //returnValue = this.createDailyTask(line);
/*     createDailyTask(line) {
        this.dailyTasks.push(line);
    } */

                        //switch ()
/*                 if (handleLineResult.eventType === EventType.INITIATE) {
                    eventCalendarDates.push(eventSourceDate);
                } */
        // Second, get all the events from a configuration file.
/*         debugger; */
/* const culture = require('../../culture/culture'); */
/* const { dic } */

/*     getDayInWeek(date) {
        if (!validationUtils.isValidDate(date)) {
            return null;
        }
        const day = date.getDay();
        return {
            englishDay: culture.englishDaysList[day],
            hebrewDay: culture.hebrewDaysList[day]
        };
    } */
/* , isSameDay */
/*                 eventMissingCalendarDates.push(new EventDate({
            id: this.lastEventId + 1,
            day: day,
            month: month,
            year: year,
            eventType: EventType.CALENDAR,
            text: spansDOMList[y].textContent
        })); */
/*             } */

/*         eventMissingCalendarDates.push(this.createEvent({
        day: day,
        month: month,
        year: year,
        eventType: EventType.CALENDAR,
        text: spansDOMList[y].textContent
    })); */
/*         this.eventDatesList.push(new EventDate({
            id: this.eventDatesList.length + 1,
            day: day,
            month: month,
            year: year,
            eventType: this.eventType,
            text: this.createSourceEventText({
                date: date,
                birthYear: year,
                line: line
            })
        })); */
/*                     eventCalendarDates.push(new EventDate({
                    id: this.lastEventId,
                    day: day,
                    month: month,
                    year: year,
                    eventType: EventType.CALENDAR,
                    text: spansDOMList[y].textContent
                }));
                this.lastEventId++; */
/*         debugger; */
/*         debugger; */
/*         debugger; */
/*         this.dailyTasks = [];
this.linesList = [];
this.calendarDaysList = []; */
/*         this.eventStaticDates = [];
        this.eventCalendarDates = [];
        this.eventSourceDates = []; */
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