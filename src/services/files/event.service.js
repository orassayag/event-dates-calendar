import { dictionaryCulture, eventCulture } from '../../culture';
import { CalendarDayModel, CommonTaskModel, EventDateModel, FutureTasksModel, SourceEventResultModel, ValidateSourceEventTypeResultModel } from '../../core/models';
import { EventTypeEnum } from '../../core/enums';
import applicationService from './application.service';
import logService from './log.service';
import pathService from './path.service';
import separatorService from './separator.service';
import { domUtils, eventUtils, fileUtils, logUtils, pathUtils, timeUtils, validationUtils } from '../../utils';

class EventService {

    constructor() {
        this.lastEventDateId = 0;
        this.lastCommonTaskId = 0;
        this.lastCalendarDayId = 0;
        this.lastFutureDayId = 0;
        this.vacationDays = dictionaryCulture.getVacationDays();
    }

    async createEventDates() {
        // First, get all the events from the Hebrew online calendar website.
        const calendarILEventDates = await this.createILCalendarEventDates();
        // Second, get all the events from the United States online calendar website.
        const calendarUSEventDates = await this.createUSCalendarEventDates();
        // Third, complete the missing events from the calendar website.
        const missingCalendarEventDates = this.createMissingCalendarEventDates(calendarILEventDates);
        // In the next step, get all the static events from an event culture file.
        const staticEventDates = this.createStaticEventDates();
        // Next, get all the events from the source event dates TXT file.
        const { sourceEventDates, dataLines, dayTasks, weekendOnToggleTasks,
            weekendOffToggleTasks, endMonthTasks, halfYearTasks, yearTasks,
            endYearTasks, futureTasks } = await this.createSourceEventDates();
        // Next, create the calendar days to log.
        const calendarDaysList = this.createCalendarDays([...calendarILEventDates, ...missingCalendarEventDates,
        ...calendarUSEventDates, ...staticEventDates, ...sourceEventDates], futureTasks);
        // Finally, log all the days into a new TXT file in the 'dist' directory.
        await logService.logEventDates({
            calendarDaysList: calendarDaysList,
            dataLines: dataLines,
            dayTasks: dayTasks,
            weekendOnToggleTasks: weekendOnToggleTasks,
            weekendOffToggleTasks: weekendOffToggleTasks,
            endMonthTasks: endMonthTasks,
            halfYearTasks: halfYearTasks,
            yearTasks: yearTasks,
            endYearTasks: endYearTasks
        });
    }

    createTextEvent(event) {
        if (!!event.eventYear || event.eventYear === 0) {
            event.text = `${event.text} (${Math.abs(parseInt(new Date().getFullYear() - event.eventYear, 10))}).`;
        }
        return event;
    }

    checkIfVacation(text) {
        return !!this.vacationDays.filter(e => text.indexOf(e) > -1).length;
    }

    createEventDate(data) {
        const { day, month, year, eventType, text, eventYear } = data;
        this.lastEventDateId++;
        return this.createTextEvent(new EventDateModel({
            id: this.lastEventDateId,
            day: day,
            month: month,
            year: year,
            eventType: eventType,
            text: text,
            eventYear: eventYear,
            isVacation: this.checkIfVacation(text)
        }));
    }

    replaceEvents(replaceEventsDates, text) {
        for (let i = 0; i < replaceEventsDates.length; i++) {
            const { include, replace } = replaceEventsDates[i];
            if (include.includes(text)) {
                text = replace;
                break;
            }
        }
        return text;
    }

    async createILCalendarEventDates() {
        const calendarILEventDates = [];
        const dom = await domUtils.getDOMFromURL(applicationService.applicationDataModel.calendarILLink);
        const daysList = dom.window.document.querySelectorAll(`.${separatorService.dayInMonthDOM},.${separatorService.todayDOM}`);
        const replaceEventsDates = eventCulture.createReplaceEventDates();
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
                    const event = this.createEventDate({
                        day: day,
                        month: month,
                        year: year,
                        eventType: EventTypeEnum.CALENDAR,
                        text: eventUtils.createEventTemplate(this.replaceEvents(replaceEventsDates, spansDOMList[y].textContent))
                    });
                    calendarILEventDates.push(event);
                    if (event.isVacation) {
                        calendarILEventDates.push(this.createEventDate({
                            day: day,
                            month: month,
                            year: year,
                            eventType: EventTypeEnum.CALENDAR,
                            text: eventUtils.createEventTemplate(dictionaryCulture.vacation)
                        }));
                    }
                }
            }
        }
        return calendarILEventDates;
    }

    async createUSCalendarEventDates() {
        const calendarUSEventDates = [];
        const dynamicEventDates = eventCulture.createDynamicEventDates();
        const dom = await domUtils.getDOMFromURL(applicationService.applicationDataModel.calendarUSLink);
        const holidaysList = dom.window.document.getElementsByTagName(separatorService.rowDOM);
        for (let i = 0; i < holidaysList.length; i++) {
            const holidayDOM = holidaysList[i];
            const cell = holidayDOM.getElementsByTagName(separatorService.cellDOM)[1];
            if (cell && cell.textContent) {
                const holidayName = cell.textContent.trim();
                const event = dynamicEventDates.find(e => e.includeText === holidayName);
                if (event) {
                    const dateUnix = holidayDOM.getAttribute(separatorService.unixDataDOM);
                    const date = timeUtils.getCurrentDate(parseInt(dateUnix));
                    const { dateDay, dateMonth, dateYear } = timeUtils.getDateParts(date);
                    calendarUSEventDates.push(this.createEventDate({
                        day: dateDay,
                        month: dateMonth,
                        year: dateYear,
                        eventType: EventTypeEnum.DYNAMIC,
                        text: eventUtils.createEventTemplate(event.displayText, false),
                        eventYear: event.eventYear
                    }));
                }
            }
        }
        return calendarUSEventDates;
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
                    eventType: EventTypeEnum.CALENDAR,
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
            const { day, month, year, eventType, text, eventYear } = staticEventDates[i];
            resultStaticEventDates.push(this.createEventDate({
                day: day,
                month: month,
                year: year,
                eventType: eventType,
                text: eventUtils.createEventTemplate(text, false),
                eventYear: eventYear
            }));
        }
        return resultStaticEventDates;
    }

    createFutureEventsDates() {

    }

    async createSourceEventDates() {
        let lineReader = null;
        let eventType = EventTypeEnum.INITIATE;
        return await new Promise(async (resolve, reject) => {
            if (reject) { }
            const sourceEventResult = new SourceEventResultModel();
            // Validate the source event dates TXT file and get the stream.
            await this.validateSourceFile({
                filePath: pathService.pathDataModel.sourcePath,
                parameterName: 'SOURCE_PATH'
            });
            // Scan the source event dates TXT file.
            lineReader = fileUtils.getFileLinesFromStream(pathService.pathDataModel.sourcePath);
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
                        case EventTypeEnum.SERVICE:
                        case EventTypeEnum.BIRTHDAY:
                        case EventTypeEnum.DEATHDAY: {
                            sourceEventResult.sourceEventDates.push(handleLineResult.returnValue);
                            break;
                        }
                        case EventTypeEnum.DAY_TASK:
                        case EventTypeEnum.WEEKEND_TASK:
                        case EventTypeEnum.WEEKEND_TOGGLE_TASK:
                        case EventTypeEnum.END_MONTH_TASK:
                        case EventTypeEnum.HALF_YEAR_TASK:
                        case EventTypeEnum.YEAR_TASK:
                        case EventTypeEnum.END_YEAR_TASK: {
                            if (!handleLineResult.isSeparator) {
                                this.lastCommonTaskId++;
                                sourceEventResult.commonTasks.push(new CommonTaskModel({
                                    id: this.lastCommonTaskId,
                                    text: handleLineResult.returnValue,
                                    type: handleLineResult.eventType
                                }));
                            }
                            break;
                        }
                        case EventTypeEnum.FUTURE_TASK: {
                            if (!handleLineResult.isSeparator && handleLineResult.returnValue.indexOf('=') === -1
                                && handleLineResult.returnValue !== separatorService.lineSpace) {
                                // Check if it's the title's date or an event that part of this date.
                                // It's the date of the event - Create the event date instance without the events texts.
                                const isDateTitle = +handleLineResult.returnValue.replace(/\D/g, '') && /^\d/.test(handleLineResult.returnValue);
                                if (isDateTitle) {
                                    let dateSplit = handleLineResult.returnValue.split('/');
                                    if (!dateSplit.length) {
                                        dateSplit = handleLineResult.returnValue.split('\\');
                                    }
                                    this.lastFutureDayId++;
                                    sourceEventResult.futureTasks.push(new FutureTasksModel({
                                        id: this.lastFutureDayId,
                                        day: +dateSplit[0],
                                        month: +dateSplit[1],
                                        year: +dateSplit[2]
                                    }));
                                } else {
                                    // It's the event's text - Fill the missing texts events data.
                                    const futureTasksIndex = sourceEventResult.futureTasks.findIndex(({ id }) => id === this.lastFutureDayId);
                                    if (futureTasksIndex > -1) {
                                        sourceEventResult.futureTasks[futureTasksIndex].addEvent(handleLineResult.returnValue);
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                eventType = handleLineResult.eventType;
                // Determine if to copy the line of data from the source or not.
                if (handleLineResult.line && eventType && ((handleLineResult.isSeparator
                    || eventType !== EventTypeEnum.COMPLETE_CANCEL_TASK && eventType !== EventTypeEnum.FUTURE_TASK))) {
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
        sourceEventResult.dayTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.DAY_TASK);
        sourceEventResult.weekendOnToggleTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.WEEKEND_TASK);
        sourceEventResult.weekendOffToggleTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.WEEKEND_TOGGLE_TASK);
        sourceEventResult.endMonthTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.END_MONTH_TASK);
        sourceEventResult.halfYearTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.HALF_YEAR_TASK);
        sourceEventResult.yearTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.YEAR_TASK);
        sourceEventResult.endYearTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.END_YEAR_TASK);
        // No need for future tasks to be re-ordered.
        sourceEventResult.commonTasks = null;
        sourceEventResult.dataLines.push(logService.logTitleSeparator);
        return sourceEventResult;
    }

    validateSourceEventType(data) {
        const { line } = data;
        let { eventType } = data;
        const validateSourceEventTypeResult = new ValidateSourceEventTypeResultModel(eventType);
        if (!line) {
            validateSourceEventTypeResult.isBreakLine = true;
            return validateSourceEventTypeResult;
        }
        if (eventType === EventTypeEnum.END) {
            return null;
        }
        if (line[0] === separatorService.eventTypeSeparator) {
            validateSourceEventTypeResult.isBreakLine = true;
            switch (eventType) {
                case EventTypeEnum.INITIATE: { eventType = EventTypeEnum.SERVICE; break; }
                case EventTypeEnum.SERVICE: { eventType = EventTypeEnum.BIRTHDAY; break; }
                case EventTypeEnum.BIRTHDAY: { eventType = EventTypeEnum.DEATHDAY; break; }
                case EventTypeEnum.DEATHDAY: { eventType = EventTypeEnum.DATA; break; }
                case EventTypeEnum.WEEKEND_TOGGLE_TASK: { eventType = EventTypeEnum.END_MONTH_TASK; break; }
                case EventTypeEnum.END_MONTH_TASK: { eventType = EventTypeEnum.HALF_YEAR_TASK; break; }
                case EventTypeEnum.HALF_YEAR_TASK: { eventType = EventTypeEnum.YEAR_TASK; break; }
                case EventTypeEnum.YEAR_TASK: { eventType = EventTypeEnum.END_YEAR_TASK; break; }
                case EventTypeEnum.END_YEAR_TASK: { eventType = EventTypeEnum.FUTURE_TASK; break; }
                case EventTypeEnum.FUTURE_TASK: { eventType = EventTypeEnum.START_EVENTS; break; }
                case EventTypeEnum.START_EVENTS: { eventType = EventTypeEnum.END; break; }
            }
        }
        else {
            validateSourceEventTypeResult.isBreakLine = true;
            validateSourceEventTypeResult.isSeparator = true;
            switch (line) {
                case separatorService.completeCancelTasksSeparator: { eventType = EventTypeEnum.COMPLETE_CANCEL_TASK; break; }
                case separatorService.dayTasksSeparator: { eventType = EventTypeEnum.DAY_TASK; break; }
                case separatorService.weekendTasksSeparator: { eventType = EventTypeEnum.WEEKEND_TASK; break; }
                case separatorService.weekendToggleTasksSeparator: { eventType = EventTypeEnum.WEEKEND_TOGGLE_TASK; break; }
                case separatorService.endMonthTasksSeparator: { eventType = EventTypeEnum.END_MONTH_TASK; break; }
                case separatorService.halfYearTasksSeparator: { eventType = EventTypeEnum.HALF_YEAR_TASK; break; }
                case separatorService.yearTasksSeparator: { eventType = EventTypeEnum.YEAR_TASK; break; }
                case separatorService.endYearTasksSeparator: { eventType = EventTypeEnum.END_YEAR_TASK; break; }
                case separatorService.futureTasksSeparator: { eventType = EventTypeEnum.FUTURE_TASK; break; }
                case separatorService.startEventsSeparator: { eventType = EventTypeEnum.START_EVENTS; break; }
                default: {
                    validateSourceEventTypeResult.isBreakLine = false;
                    validateSourceEventTypeResult.isSeparator = false;
                    break;
                }
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
            case EventTypeEnum.SERVICE:
            case EventTypeEnum.BIRTHDAY:
            case EventTypeEnum.DEATHDAY: {
                returnValue = this.createSourceEvent({
                    line: line,
                    eventType: eventType
                });
                break;
            }
            case EventTypeEnum.COMPLETE_CANCEL_TASK: {
                line = isSeparator ? eventUtils.warpBreakLine(line) : line;
                break;
            }
            case EventTypeEnum.DAY_TASK:
            case EventTypeEnum.WEEKEND_TASK:
            case EventTypeEnum.WEEKEND_TOGGLE_TASK:
            case EventTypeEnum.END_MONTH_TASK:
            case EventTypeEnum.HALF_YEAR_TASK:
            case EventTypeEnum.YEAR_TASK:
            case EventTypeEnum.END_YEAR_TASK:
            case EventTypeEnum.FUTURE_TASK: {
                returnValue = line;
                break;
            }
            case EventTypeEnum.END: {
                if (!isSeparator) {
                    line = null;
                }
                break;
            }
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
        // Check if the line includes a date. If so, it's a service / birthday / deathday event.
        const date = timeUtils.getDatePartsFromText(line);
        if (!date) {
            return;
        }
        const dateParts = date.split('/');
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const year = validationUtils.isIndexExists(dateParts, 2) ? parseInt(dateParts[2]) : null;
        if (eventType === EventTypeEnum.SERVICE && year !== applicationService.applicationDataModel.year) {
            return;
        }
        return this.createEventDate({
            day: day,
            month: month,
            year: year,
            eventType: eventType,
            text: this.createSourceEventText({
                date: date,
                year: year,
                line: line,
                eventType: eventType
            })
        });
    }

    // If the event is of 'birthday' or 'deathday' types, replace the birthdate or the deathday with the future age.
    createSourceEventText(data) {
        const { date, year, line, eventType } = data;
        let result = line;
        let eventTemplate = null;
        switch (eventType) {
            case EventTypeEnum.BIRTHDAY: {
                eventTemplate = 'Birth';
                break;
            }
            case EventTypeEnum.DEATHDAY: {
                eventTemplate = 'Death';
                break;
            }
        }
        if (eventTemplate) {
            const age = result.replace(date, `(${timeUtils.getAge({
                targetYear: applicationService.applicationDataModel.year,
                year: year
            })})`);
            result = eventUtils.getDayEventTemplate(dictionaryCulture[`hebrew${eventTemplate}Day`], age);
        }
        return result;
    }

    async validateSourceFile(data) {
        const { filePath, parameterName } = data;
        if (!await fileUtils.isPathExists(filePath)) {
            throw new Error(`Path not exists: ${filePath} (1000003)`);
        }
        if (!fileUtils.isFilePath(filePath)) {
            throw new Error(`The parameter path ${parameterName} marked as file but it's a path of a directory: ${filePath} (1000004)`);
        }
        const extension = pathUtils.getExtname(filePath);
        if (extension !== '.txt') {
            throw new Error(`The parameter path ${parameterName} must be a TXT file but it's: ${extension} file (1000005)`);
        }
    }

    addFutureEvents(data) {
        const { calendarDayModel, futureEvents, dateDay, dateMonth } = data;
        calendarDayModel.futureEventDatesList = futureEvents.filter(e => {
            return e.day === dateDay && e.month === dateMonth;
        });
        return calendarDayModel;
    }

    createCalendarDays(allEvents, futureEvents) {
        const calendarDaysList = [];
        // Create the calendar days list array.
        const dateStart = timeUtils.getCurrentDate([applicationService.applicationDataModel.year, 0, 1]);
        const dateEnd = timeUtils.getCurrentDate(dateStart);
        dateEnd.setFullYear(dateEnd.getFullYear() + 1);
        while (dateStart < dateEnd || calendarDaysList.length < timeUtils.daysInYear) {
            const { dateDay, dateMonth, dateYear } = timeUtils.getDateParts(dateStart);
            const { englishDay, hebrewDay } = this.getDayInWeek(dateStart);
            this.lastCalendarDayId++;
            // Create the event day calender.
            let calendarDayModel = new CalendarDayModel({
                id: this.lastCalendarDayId,
                date: new Date(dateStart),
                displayDate: timeUtils.getDisplayDate(dateStart),
                dayInWeek: englishDay,
                displayDayInWeek: hebrewDay,
                eventDatesList: allEvents.filter(e => e.day === dateDay && e.month === dateMonth)
            });
            // Add the future event dates (If any exists).
            calendarDayModel = this.addFutureEvents({
                calendarDayModel,
                futureEvents,
                dateDay: dateDay,
                dateMonth: dateMonth
            });
            // Add the repeat event date.
            calendarDayModel = this.createRepeatEventDate({
                calendarDayModel: calendarDayModel,
                dateDay: dateDay,
                dateMonth: dateMonth,
                dateYear: dateYear
            });
            calendarDaysList.push(calendarDayModel);
            dateStart.setDate(dateDay + 1);
        }
        return [...calendarDaysList.sort((a, b) => b.id - a.id)];
    }

    createRepeatEventDate(data) {
        const { calendarDayModel, dateDay, dateMonth, dateYear } = data;
        // Get repeat logic events (Like friday the 13th).
        const repeatEventDates = eventCulture.createRepeatEventDates();
        for (let i = 0; i < repeatEventDates.length; i++) {
            const { day, dayInWeek, displayText, eventYear } = repeatEventDates[i];
            if (day === dateDay && calendarDayModel.dayInWeek === dictionaryCulture.englishDaysList[dayInWeek]) {
                calendarDayModel.eventDatesList.push(this.createEventDate({
                    day: dateDay,
                    month: dateMonth,
                    year: dateYear,
                    eventType: EventTypeEnum.REPEAT,
                    text: eventUtils.createEventTemplate(displayText, false),
                    eventYear: eventYear
                }));
            }
        }
        return calendarDayModel;
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
        // Validate the source event dates TXT file and get the stream.
        await this.validateSourceFile({
            filePath: pathService.pathDataModel.sourcePath,
            parameterName: 'SOURCE_PATH'
        });
        // Scan the source event dates TXT file.
        lineReader = fileUtils.getFileLinesFromStream(pathService.pathDataModel.sourcePath);
        lineReader.on('line', (line) => {
            if (!line) {
                return;
            }
            if (line[0] !== separatorService.startLineCharacter ||
                line[line.length - 1] !== separatorService.endLineCharacter) {
                logUtils.log(line);
            }
        });
    }
}

export default new EventService();