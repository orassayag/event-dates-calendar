const { dictionaryCulture } = require('../../culture');
const { LogData } = require('../../core/models');
const applicationService = require('./application.service');
const pathService = require('./path.service');
const { eventUtils, fileUtils, textUtils, validationUtils } = require('../../utils');

class LogService {

	constructor() {
		// ===PATH=== //
		this.logData = null;
		this.baseSessionPath = null;
		this.distFileName = null;
		this.logSeparator = '==========';
	}

	async initiate(settings) {
		this.logData = new LogData(settings);
		await this.initiateDirectories();
	}

	async initiateDirectories() {
		// ===PATH=== //
		this.baseSessionPath = pathService.pathData.distPath;
		fileUtils.createDirectory(this.baseSessionPath);
		await fileUtils.emptyDirectory(this.baseSessionPath);
		this.distFileName = `${this.baseSessionPath}\\${this.logData.distFileName}-${applicationService.applicationData.year}.txt`;
	}

	async logEventDates(data) {
		const { calendarDaysList, dataLines, dailyTasks, weekendTasks, weekendOnToggleTasks, weekendOffToggleTasks } = data;
		let isToggleWeekend = true;
		const dailyTasksLines = eventUtils.warpBreakLines(dailyTasks);
		const weekendTasksLines = eventUtils.warpBreakLines(weekendTasks);
		const weekendToggleOnTasksLines = eventUtils.warpEmpty(weekendOnToggleTasks);
		const weekendToggleOffTasksLines = eventUtils.warpEmpty(weekendOffToggleTasks);
		// Merge all the calendar days into lines array.
		const eventsDatesLines = [];
		for (let i = 0; i < calendarDaysList.length; i++) {
			const { displayDate, dayInWeek, displayDayInWeek, eventDatesList } = calendarDaysList[i];
			const eventDatesLines = validationUtils.isExists(eventDatesList) ? eventUtils.warpBreakLine(eventUtils.warpBreakLines(eventDatesList.map(e => e.text))) : '';
			eventsDatesLines.push(`${displayDate} ${displayDayInWeek}\n${eventDatesLines}${dailyTasksLines}`);
			if (dayInWeek === dictionaryCulture.englishDaysList[5]) {
				eventsDatesLines.push(weekendTasksLines);
				eventsDatesLines.push(eventUtils.warpBreakLine(isToggleWeekend ? weekendToggleOnTasksLines : weekendToggleOffTasksLines));
				isToggleWeekend = !isToggleWeekend;
			}
			else {
				eventsDatesLines.push('\r');
			}
		}
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
		let settingsText = '';
		settingsText += Object.keys(settings).filter(s => parameters.indexOf(s) > -1)
			.map(k => this.createLineTemplate(k, settings[k])).join('');
		settingsText = textUtils.removeLastCharacter(settingsText);
		return `${textUtils.setLogStatus('IMPORTANT SETTINGS')}
${settingsText}
========================
OK to run? (y = yes)`;
	}
}

module.exports = new LogService();