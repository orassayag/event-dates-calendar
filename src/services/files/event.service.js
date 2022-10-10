import { dictionaryCulture, eventCulture } from '../../culture';
import { CalendarDayModel, CommonTaskModel, EventDateModel, SourceEventResultModel, ValidateSourceEventTypeResultModel } from '../../core/models';
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
        const { sourceEventDates, dataLines, dailyTasks, weekendOnToggleTasks,
            weekendOffToggleTasks, monthlyTasks, halfYearlyTasks } = await this.createSourceEventDates();
        // Next, create the calendar days to log.
        const calendarDaysList = this.createCalendarDays([...calendarILEventDates, ...missingCalendarEventDates,
        ...calendarUSEventDates, ...staticEventDates, ...sourceEventDates]);
        // Finally, log all the days into a new TXT file in the 'dist' directory.
        await logService.logEventDates({
            calendarDaysList: calendarDaysList,
            dataLines: dataLines,
            dailyTasks: dailyTasks,
            weekendOnToggleTasks: weekendOnToggleTasks,
            weekendOffToggleTasks: weekendOffToggleTasks,
            monthlyTasks: monthlyTasks,
            halfYearlyTasks: halfYearlyTasks
        });
    }

    createTextEvent(event) {
        if (!!event.eventYear || event.eventYear === 0) {
            event.text = `${event.text} (${Math.abs(parseInt(new Date().getFullYear() - event.eventYear, 10))}).`;
        }
        return event;
    }

    checkIfVacation(text) {
        return !!this.vacationDays.filter(e => {
            return e.includes(text);
        }).length;
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
        // const today = dom.window.document.getElementsByClassName(separatorService.todayDOM);
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
                    calendarILEventDates.push(this.createEventDate({
                        day: day,
                        month: month,
                        year: year,
                        eventType: EventTypeEnum.CALENDAR,
                        text: eventUtils.createEventTemplate(this.replaceEvents(replaceEventsDates, spansDOMList[y].textContent))
                    }));
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
                        text: eventUtils.createEventTemplate(event.displayText),
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
                text: eventUtils.createEventTemplate(text),
                eventYear: eventYear
            }));
        }
        return resultStaticEventDates;
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
                        case EventTypeEnum.DAILY_TASK:
                        case EventTypeEnum.WEEKEND_TASK:
                        case EventTypeEnum.WEEKEND_TOGGLE_TASK:
                        case EventTypeEnum.MONTHLY_TASK:
                        case EventTypeEnum.HALF_YEARLY_TASK: {
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
                    }
                }
                eventType = handleLineResult.eventType;
                if (handleLineResult.line && eventType && (handleLineResult.isSeparator ||
                    eventType !== EventTypeEnum.COMPLETE_CANCEL_TASK)) {
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
        sourceEventResult.dailyTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.DAILY_TASK);
        sourceEventResult.weekendOnToggleTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.WEEKEND_TASK);
        sourceEventResult.weekendOffToggleTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.WEEKEND_TOGGLE_TASK);
        sourceEventResult.monthlyTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.MONTHLY_TASK);
        sourceEventResult.halfYearlyTasks = this.filterSortTasks(sourceEventResult.commonTasks, EventTypeEnum.HALF_YEARLY_TASK);
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
                case EventTypeEnum.WEEKEND_TOGGLE_TASK: { eventType = EventTypeEnum.MONTHLY_TASK; break; }
                case EventTypeEnum.MONTHLY_TASK: { eventType = EventTypeEnum.HALF_YEARLY_TASK; break; }
                case EventTypeEnum.HALF_YEARLY_TASK: { eventType = EventTypeEnum.END; break; }
            }
        }
        else {
            validateSourceEventTypeResult.isBreakLine = true;
            validateSourceEventTypeResult.isSeparator = true;
            switch (line) {
                case separatorService.completeCancelTasksSeparator: { eventType = EventTypeEnum.COMPLETE_CANCEL_TASK; break; }
                case separatorService.dailyTasksSeparator: { eventType = EventTypeEnum.DAILY_TASK; break; }
                case separatorService.weekendTasksSeparator: { eventType = EventTypeEnum.WEEKEND_TASK; break; }
                case separatorService.weekendToggleTasksSeparator: { eventType = EventTypeEnum.WEEKEND_TOGGLE_TASK; break; }
                case separatorService.monthlyTasksSeparator: { eventType = EventTypeEnum.MONTHLY_TASK; break; }
                case separatorService.halfYearlyTasksSeparator: { eventType = EventTypeEnum.HALF_YEARLY_TASK; break; }
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
            case EventTypeEnum.DAILY_TASK:
            case EventTypeEnum.WEEKEND_TASK:
            case EventTypeEnum.WEEKEND_TOGGLE_TASK:
            case EventTypeEnum.MONTHLY_TASK:
            case EventTypeEnum.HALF_YEARLY_TASK: {
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

    createCalendarDays(allEvents) {
        const calendarDaysList = [];
        // Create the calendar days list array.
        const dateStart = timeUtils.getCurrentDate([applicationService.applicationDataModel.year, 0, 1]);
        const dateEnd = timeUtils.getCurrentDate(dateStart);
        dateEnd.setFullYear(dateEnd.getFullYear() + 1);
        while (dateStart < dateEnd || calendarDaysList.length < timeUtils.daysInYear) {
            const { dateDay, dateMonth, dateYear } = timeUtils.getDateParts(dateStart);
            const { englishDay, hebrewDay } = this.getDayInWeek(dateStart);
            this.lastCalendarDayId++;
            let calendarDayModel = new CalendarDayModel({
                id: this.lastCalendarDayId,
                date: new Date(dateStart),
                displayDate: timeUtils.getDisplayDate(dateStart),
                dayInWeek: englishDay,
                displayDayInWeek: hebrewDay,
                eventDatesList: allEvents.filter(e => {
                    return e.day === dateDay && e.month === dateMonth;
                })
            });
            calendarDayModel = this.createRepeatEventDate({
                calendarDayModel: calendarDayModel,
                dateDay: dateDay,
                dateMonth: dateMonth,
                dateYear: dateYear
            });
            calendarDaysList.push(calendarDayModel);
            dateStart.setDate(dateDay + 1);
        }
        calendarDaysList.reverse();
        return calendarDaysList;
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
                    text: eventUtils.createEventTemplate(displayText),
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