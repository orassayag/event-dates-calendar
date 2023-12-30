import { dictionaryCulture } from '../../culture/index.js';
import { LogDataModel } from '../../core/models/index.js';
import applicationService from './application.service.js';
import separatorService from './separator.service.js';
import pathService from './path.service.js';
import {
  eventUtils,
  fileUtils,
  textUtils,
  validationUtils,
} from '../../utils/index.js';

class LogService {
  constructor() {
    // ===PATH=== //
    this.logDataModel = null;
    this.baseSessionPath = null;
    this.distFileName = null;
    this.logTitleSeparator = '=====\r\r';
    this.lineSeparator = '================\r\r';
  }

  async initiate(settings) {
    this.logDataModel = new LogDataModel(settings);
    await this.initiateDirectories();
  }

  async initiateDirectories() {
    // ===PATH=== //
    this.baseSessionPath = pathService.pathDataModel.distPath;
    fileUtils.createDirectory(this.baseSessionPath);
    await fileUtils.emptyDirectory(this.baseSessionPath);
    this.distFileName = `${this.baseSessionPath}\\${this.logDataModel.distFileName}-${applicationService.applicationDataModel.year}.txt`;
  }

  isAddDot(eventsDatesLine) {
    if (!eventsDatesLine.length) {
      return false;
    }
    switch (eventsDatesLine) {
      case separatorService.lineSpace:
      case separatorService.completeCancelTasksSeparator:
      case separatorService.dayTasksSeparator:
      case separatorService.weekendTasksSeparator:
      case separatorService.weekendToggleTasksSeparator:
      case separatorService.endMonthTasksSeparator:
      case separatorService.halfYearTasksSeparator:
      case separatorService.yearTasksSeparator:
      case separatorService.endYearTasksSeparator:
        return false;
    }
    const lastCharacter = eventsDatesLine[eventsDatesLine.length - 1];
    switch (lastCharacter) {
      case separatorService.endLineCharacter:
      case separatorService.dotLineCharacter:
      case separatorService.eventTypeSeparator:
      case separatorService.titleTypeSeparator:
        return false;
    }
    return true;
  }

  prepareLines(eventsDatesLines) {
    for (let i = 0; i < eventsDatesLines.length; i++) {
      const line = eventsDatesLines[i]?.trim();
      if (this.isAddDot(line)) {
        eventsDatesLines[i] = `${line}${separatorService.dotLineCharacter}`;
      }
    }
    return eventsDatesLines;
  }

  async logEventDates(data) {
    const {
      calendarDaysList,
      dayTasks,
      weekendOnToggleTasks,
      weekendOffToggleTasks,
      endMonthTasks,
      halfYearTasks,
      yearTasks,
      endYearTasks,
    } = data;
    let { dataLines } = data;
    let isToggleWeekend = true;
    const dayTasksLines = eventUtils.warpBreakLines(dayTasks);
    const weekendToggleOnTasksLines =
      eventUtils.warpBreakLines(weekendOnToggleTasks);
    const weekendToggleOffTasksLines = eventUtils.warpBreakLines(
      weekendOffToggleTasks
    );
    const endMonthTasksLines = eventUtils.warpBreakLines(endMonthTasks);
    const halfYearTasksLines = eventUtils.warpBreakLines(halfYearTasks);
    const yearTasksLines = eventUtils.warpBreakLines(yearTasks);
    const endYearTasksLines = eventUtils.warpBreakLines(endYearTasks);
    // Merge all the calendar days into lines array.
    let eventsDatesLines = [];
    for (let i = 0; i < calendarDaysList.length; i++) {
      const {
        date,
        displayDate,
        dayInWeek,
        displayDayInWeek,
        eventDatesList,
        futureEventDatesList,
      } = calendarDaysList[i];
      const month = date.getMonth() + 1; // Months from 1-12.
      const day = date.getDate();
      const lastDayOfMonth = new Date(
        applicationService.applicationDataModel.year,
        month,
        0
      ).getDate();
      const eventDatesLines = validationUtils.isExists(eventDatesList)
        ? eventUtils.warpBreakLine(
            eventUtils.warpBreakLines(eventDatesList.map((e) => e.text))
          )
        : '';
      const futureEventDatesLines = validationUtils.isExists(
        futureEventDatesList
      )
        ? [
            ...futureEventDatesList.map((e) =>
              eventUtils.warpBreakLine(eventUtils.warpBreakLines(e.eventsLines))
            ),
          ]
        : '';
      // Day title + Day tasks.
      eventsDatesLines.push(
        `${displayDate} ${displayDayInWeek}.\n${eventDatesLines}${dayTasksLines}`
      );
      // Future day tasks.
      if (futureEventDatesLines.length) {
        eventsDatesLines = [...eventsDatesLines, ...futureEventDatesLines];
      }
      // Weekend + Weekend toggle Tasks.
      if (dayInWeek === dictionaryCulture.englishDaysList[5]) {
        eventsDatesLines.push(
          isToggleWeekend
            ? weekendToggleOnTasksLines
            : weekendToggleOffTasksLines
        );
        isToggleWeekend = !isToggleWeekend;
      }
      if (day === 1) {
        if (month === 1) {
          // Year tasks.
          eventsDatesLines.push(eventUtils.warpBreakLine(yearTasksLines));
        } else if (month === 2 || month === 11) {
          // Half year tasks.
          eventsDatesLines.push(eventUtils.warpBreakLine(halfYearTasksLines));
        } else {
          eventsDatesLines.push(separatorService.lineSpace);
        }
      } else if (day === lastDayOfMonth) {
        // End month tasks.
        eventsDatesLines.push(eventUtils.warpBreakLine(endMonthTasksLines));
      } else if (day === 31 && month === 12) {
        // End year tasks.
        eventsDatesLines.push(eventUtils.warpBreakLine(endYearTasksLines));
      } else {
        eventsDatesLines.push(separatorService.lineSpace);
      }
      // Add line separators between days.
      eventsDatesLines.push(this.lineSeparator);
    }
    eventsDatesLines = this.prepareLines(eventsDatesLines);
    dataLines = this.prepareLines(dataLines);
    // Log all the lines into a new TXT file.
    const eventDatesLogLines = eventUtils
      .warpBreakLines([...dataLines, ...eventsDatesLines])
      .trim();
    await fileUtils.appendFile({
      targetPath: this.distFileName,
      message: eventDatesLogLines,
    });
  }

  createLineTemplate(title, value) {
    return textUtils.addBreakLine(`${title}: ${value}`);
  }

  createConfirmSettingsTemplate(settings) {
    const parameters = ['YEAR', 'DIST_FILE_NAME'];
    let settingsText = Object.keys(settings)
      .filter((s) => parameters.indexOf(s) > -1)
      .map((k) => this.createLineTemplate(k, settings[k]))
      .join('');
    settingsText = textUtils.removeLastCharacters({
      value: settingsText,
      charactersCount: 1,
    });
    return `${textUtils.setLogStatus('IMPORTANT SETTINGS')}
${settingsText}
========================
OK to run? (y = yes)`;
  }
}

export default new LogService();
