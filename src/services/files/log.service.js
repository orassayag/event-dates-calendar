import { dictionaryCulture } from '../../culture';
import { LogDataModel } from '../../core/models';
import applicationService from './application.service';
import separatorService from './separator.service';
import pathService from './path.service';
import { eventUtils, fileUtils, textUtils, validationUtils } from '../../utils';

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
			case separatorService.dailyTasksSeparator:
			case separatorService.weekendTasksSeparator:
			case separatorService.weekendToggleTasksSeparator:
			case separatorService.monthlyTasksSeparator:
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
		const { calendarDaysList, dailyTasks, weekendOnToggleTasks, weekendOffToggleTasks, monthlyTasks } = data;
		let { dataLines } = data;
		let isToggleWeekend = true;
		const dailyTasksLines = eventUtils.warpBreakLines(dailyTasks);
		const weekendToggleOnTasksLines = eventUtils.warpBreakLines(weekendOnToggleTasks);
		const weekendToggleOffTasksLines = eventUtils.warpBreakLines(weekendOffToggleTasks);
		const monthlyTasksLines = eventUtils.warpBreakLines(monthlyTasks);
		// Merge all the calendar days into lines array.
		let eventsDatesLines = [];
		for (let i = 0; i < calendarDaysList.length; i++) {
			const { date, displayDate, dayInWeek, displayDayInWeek, eventDatesList } = calendarDaysList[i];
			const eventDatesLines = validationUtils.isExists(eventDatesList) ? eventUtils.warpBreakLine(eventUtils.warpBreakLines(eventDatesList.map(e => e.text))) : '';
			eventsDatesLines.push(`${displayDate} ${displayDayInWeek}\n${eventDatesLines}${dailyTasksLines}`);
			if (dayInWeek === dictionaryCulture.englishDaysList[5]) {
				eventsDatesLines.push(isToggleWeekend ? weekendToggleOnTasksLines : weekendToggleOffTasksLines);
				isToggleWeekend = !isToggleWeekend;
			}
			if (date.getDate() === 1) {
				eventsDatesLines.push(eventUtils.warpBreakLine(monthlyTasksLines));
			} else {
				// Add line seperators between days.
				eventsDatesLines.push(separatorService.lineSpace);
			}
			eventsDatesLines.push(this.lineSeparator);
		}
		eventsDatesLines = this.prepareLines(eventsDatesLines);
		dataLines = this.prepareLines(dataLines);
		// Log all the lines into a new TXT file.
		const eventDatesLogLines = eventUtils.warpBreakLines([...dataLines, ...eventsDatesLines]).trim();
		await fileUtils.appendFile({
			targetPath: this.distFileName,
			message: eventDatesLogLines
		});
	}

	createLineTemplate(title, value) {
		return textUtils.addBreakLine(`${title}: ${value}`);
	}

	createConfirmSettingsTemplate(settings) {
		const parameters = ['YEAR', 'DIST_FILE_NAME'];
		let settingsText = Object.keys(settings).filter(s => parameters.indexOf(s) > -1)
			.map(k => this.createLineTemplate(k, settings[k])).join('');
		settingsText = textUtils.removeLastCharacters({
			value: settingsText,
			charactersCount: 1
		});
		return `${textUtils.setLogStatus('IMPORTANT SETTINGS')}
${settingsText}
========================
OK to run? (y = yes)`;
	}
}

export default new LogService();