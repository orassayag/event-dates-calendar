const { dictionaryCulture, eventCulture } = require('../../culture');
const { CalendarDay, CommonTask, EventDate, SourceEventResult, ValidateSourceEventTypeResult } = require('../../core/models');
const { EventType } = require('../../core/enums');
const applicationService = require('./application.service');
const logService = require('./log.service');
const pathService = require('./path.service');
const separatorService = require('./separator.service');
const { domUtils, eventUtils, fileUtils, logUtils, pathUtils,
    timeUtils, validationUtils } = require('../../utils');

class EventService {

    constructor() {
        this.lastEventDateId = 0;
        this.lastCommonTaskId = 0;
        this.lastCalendarDayId = 0;
    }

    async createEventDates() {
        // First, get all the events from the online calendar website.
        const calendarEventDates = await this.createCalendarEventDates();
        // Second, complete the missing events from the calendar website.
        const missingCalendarEventDates = this.createMissingCalendarEventDates(calendarEventDates);
        // Third, get all the static events from an event culture file.
        const staticEventDates = this.createStaticEventDates();
        // Next, get all the events from the source event dates TXT file.
        const { sourceEventDates, dataLines, dailyTasks, weekendTasks,
            weekendOnToggleTasks, weekendOffToggleTasks } = await this.createSourceEventDates();
        // Next, create the calendar days to log.
        const calendarDaysList = this.createCalendarDays([...calendarEventDates, ...missingCalendarEventDates,
        ...staticEventDates, ...sourceEventDates]);
        // Finally, log all the days into a new TXT file in the 'dist' directory.
        await logService.logEventDates({
            calendarDaysList: calendarDaysList,
            dataLines: dataLines,
            dailyTasks: dailyTasks,
            weekendTasks: weekendTasks,
            weekendOnToggleTasks: weekendOnToggleTasks,
            weekendOffToggleTasks: weekendOffToggleTasks
        });
    }

    createEventDate(data) {
        const { day, month, year, eventType, text } = data;
        this.lastEventDateId++;
        return new EventDate({
            id: this.lastEventDateId,
            day: day,
            month: month,
            year: year,
            eventType: eventType,
            text: text
        });
    }

    async createCalendarEventDates() {
        const calendarEventDates = [];
        const dom = await domUtils.getDOMFromURL(applicationService.applicationData.calendarLink);
        const daysList = dom.window.document.getElementsByClassName(separatorService.dayInMonthDOM);
        for (let i = 0; i < daysList.length; i++) {
            const dayDOM = daysList[i];
            if (!dayDOM.textContent.trim()) {
                continue;
            }
            const spansDOMList = dayDOM.getElementsByTagName(separatorService.spanDOM);
            if (spansDOMList.length > 1) {
                // Example of day Id: id20211214.
                const dayIdDOM = dayDOM.getElementsByClassName(separatorService.personalDOM)[0].getAttribute(separatorService.idDOM);
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
                return e.text.indexOf(includeText) > -1 && e.text.indexOf(excludeText ? excludeText : separatorService.toggleSeparator) === -1;
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
                        case EventType.WEEKEND_TASK:
                        case EventType.WEEKEND_TOGGLE_TASK:
                            if (!handleLineResult.isSeparator) {
                                this.lastCommonTaskId++;
                                sourceEventResult.commonTasks.push(new CommonTask({
                                    id: this.lastCommonTaskId,
                                    text: handleLineResult.returnValue,
                                    type: handleLineResult.eventType
                                }));
                            }
                            break;
                    }
                }
                eventType = handleLineResult.eventType;
                if (handleLineResult.line && eventType && (handleLineResult.isSeparator ||
                    eventType !== EventType.COMPLETE_CANCEL_TASK)) {
                    sourceEventResult.dataLines.push(handleLineResult.line);
                }
            });
            lineReader.on('close', () => {
                resolve(this.finalizeSourceEventResult(sourceEventResult));
                return;
            });
        });
    }

    filterSortTasks(tasks, eventType) {
        return tasks.filter(t => t.type === eventType).sort((a, b) => (a.id > b.id) ? 1 : -1).map(t => t.text);
    }

    finalizeSourceEventResult(sourceEventResult) {
        // Convert all the common tasks to different days.
        sourceEventResult.commonTasks.splice(-2);
        sourceEventResult.dailyTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventType.DAILY_TASK);
        sourceEventResult.weekendTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventType.WEEKEND_TASK);
        const weekendToggleTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventType.WEEKEND_TOGGLE_TASK);
        for (let i = 0; i < weekendToggleTasks.length; i++) {
            const task = weekendToggleTasks[i];
            const splitToggle = task.split(separatorService.toggleSeparator);
            sourceEventResult.weekendOnToggleTasks.push(task);
            sourceEventResult.weekendOffToggleTasks.push(eventUtils.toggleOfTaskTemplate(splitToggle[0]));
        }
        sourceEventResult.commonTasks = null;
        return sourceEventResult;
    }

    validateSourceEventType(data) {
        const { line } = data;
        let { eventType } = data;
        const validateSourceEventTypeResult = new ValidateSourceEventTypeResult(eventType);
        if (!line) {
            validateSourceEventTypeResult.isBreakLine = true;
            return validateSourceEventTypeResult;
        }
        if (eventType === EventType.END) {
            return null;
        }
        if (line[0] === separatorService.eventTypeSeparator) {
            validateSourceEventTypeResult.isBreakLine = true;
            switch (eventType) {
                case EventType.INITIATE: eventType = EventType.SERVICE; break;
                case EventType.SERVICE: eventType = EventType.BIRTHDAY; break;
                case EventType.BIRTHDAY: eventType = EventType.DATA; break;
                case EventType.WEEKEND_TOGGLE_TASK: eventType = EventType.END; validateSourceEventTypeResult.isSeparator = true; break;
            }
        }
        else {
            validateSourceEventTypeResult.isBreakLine = true;
            validateSourceEventTypeResult.isSeparator = true;
            switch (line) {
                case separatorService.completeCancelTasksSeparator: eventType = EventType.COMPLETE_CANCEL_TASK; break;
                case separatorService.dailyTasksSeparator: eventType = EventType.DAILY_TASK; break;
                case separatorService.weekendTasksSeparator: eventType = EventType.WEEKEND_TASK; break;
                case separatorService.weekendToggleTasksSeparator: eventType = EventType.WEEKEND_TOGGLE_TASK; break;
                default:
                    validateSourceEventTypeResult.isBreakLine = false;
                    validateSourceEventTypeResult.isSeparator = false;
                    break;
            }
        }
        validateSourceEventTypeResult.eventType = eventType;
        return validateSourceEventTypeResult;
    }

    handleLine(data) {
        let returnValue, returnToggleValue = null;
        let { line } = data;
        const { lineReader } = data;
        // Check if to add the line to the lines list, in order to include them in the new TXT file.
        const validateEventResult = this.validateSourceEventType(data);
        // When there is no event type result, the readline process is no longer necessary - Close it.
        if (!validateEventResult) {
            lineReader.close();
            return null;
        }
        const { eventType, isBreakLine, isSeparator } = validateEventResult;
        line = isBreakLine ? eventUtils.warpBreakRLines(line) : line;
        switch (eventType) {
            case EventType.SERVICE:
            case EventType.BIRTHDAY:
                returnValue = this.createSourceEvent({
                    line: line,
                    eventType: eventType
                });
                break;
            case EventType.COMPLETE_CANCEL_TASK:
                line = isSeparator ? eventUtils.warpBreakLine(line) : line;
                break;
            case EventType.DAILY_TASK:
            case EventType.WEEKEND_TASK:
            case EventType.WEEKEND_TOGGLE_TASK:
                returnValue = line;
                break;
            case EventType.END:
                if (!isSeparator) {
                    line = null;
                }
                break;
        }
        return {
            eventType: eventType,
            line: line,
            returnValue: returnValue,
            returnToggleValue: returnToggleValue,
            isSeparator: isSeparator
        };
    }

    createSourceEvent(data) {
        const { line, eventType } = data;
        // Check if the line includes a date. If so, it's a service / birthday event.
        const date = timeUtils.getDatePartsFromText(line);
        if (!date) {
            return;
        }
        const dateParts = date.split('/');
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const year = validationUtils.isIndexExists(dateParts, 2) ? parseInt(dateParts[2]) : null;
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
            throw new Error(`Invalid or no ${parameterName} parameter was found: Expected a number but received: ${filePath} (1000003)`);
        }
        if (!fileUtils.isFilePath(filePath)) {
            throw new Error(`The parameter path ${parameterName} marked as file but it's a path of a directory: ${filePath} (1000004)`);
        }
        const extension = pathUtils.getExtname(filePath);
        if (extension !== '.txt') {
            throw new Error(`The parameter path ${parameterName} must be a TXT file but it's: ${extension} file (1000005)`);
        }
    }

    createCalendarDays(allEvents) {
        const calendarDaysList = [];
        // Create the calendar days list array.
        const date = new Date(applicationService.applicationData.year, 0, 1);
        const end = new Date(date);
        end.setFullYear(end.getFullYear() + 1);
        while (date < end || calendarDaysList.length < timeUtils.daysInYear) {
            const { englishDay, hebrewDay } = this.getDayInWeek(date);
            this.lastCalendarDayId++;
            calendarDaysList.push(new CalendarDay({
                id: this.lastCalendarDayId,
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

    async scanSourceFile() {
        let lineReader = null;
        return await new Promise(async (resolve, reject) => {
            if (reject) { }
            // Validate the source event dates TXT file and get the stream.
            await this.validateSourceFile({
                filePath: pathService.pathData.sourcePath,
                parameterName: 'SOURCE_PATH'
            });
            // Scan the source event dates TXT file.
            lineReader = fileUtils.getFileLinesFromStream(pathService.pathData.sourcePath);
            lineReader.on('line', (line) => {
                if (!line) {
                    return;
                }
                if (line[0] !== separatorService.startLineCharacter ||
                    line[line.length - 1] !== separatorService.endLineCharacter) {
                    logUtils.log(line);
                }
            });
        });
    }
}

module.exports = new EventService();