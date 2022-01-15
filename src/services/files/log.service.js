import { dictionaryCulture } from '../../culture';
import { LogDataModel } from '../../core/models';
import applicationService from './application.service';
import pathService from './path.service';
import { eventUtils, fileUtils, textUtils, validationUtils } from '../../utils';

class LogService {

	constructor() {
		// ===PATH=== //
		this.logDataModel = null;
		this.baseSessionPath = null;
		this.distFileName = null;
		this.logSeparator = '==========';
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

	async logEventDates(data) {
		const { calendarDaysList, dataLines, dailyTasks, weekendOnToggleTasks, weekendOffToggleTasks } = data;
		let isToggleWeekend = true;
		const dailyTasksLines = eventUtils.warpBreakLines(dailyTasks);
		const weekendToggleOnTasksLines = eventUtils.warpBreakLines(weekendOnToggleTasks);
		const weekendToggleOffTasksLines = eventUtils.warpBreakLines(weekendOffToggleTasks);
		// Merge all the calendar days into lines array.
		const eventsDatesLines = [];
		for (let i = 0; i < calendarDaysList.length; i++) {
			const { displayDate, dayInWeek, displayDayInWeek, eventDatesList } = calendarDaysList[i];
			const eventDatesLines = validationUtils.isExists(eventDatesList) ? eventUtils.warpBreakLine(eventUtils.warpBreakLines(eventDatesList.map(e => e.text))) : '';
			eventsDatesLines.push(`${displayDate} ${displayDayInWeek}\n${eventDatesLines}${dailyTasksLines}`);
			if (dayInWeek === dictionaryCulture.englishDaysList[5]) {
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