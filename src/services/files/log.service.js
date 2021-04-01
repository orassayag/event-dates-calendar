const { LogData } = require('../../core/models');
const pathService = require('./path.service');
const { fileUtils } = require('../../utils');

class LogService {

	constructor() {
		// ===PATH=== //
		this.baseSessionPath = null;
		this.logSeparator = '==========';
	}

	async initiate(settings) {
		this.logData = new LogData(settings);
		await this.initiateDirectories();
	}

	async initiateDirectories() {
		// ===PATH=== //
		this.baseSessionPath = pathService.pathData.distPath;
		await fileUtils.emptyDirectory(this.baseSessionPath);
		fileUtils.createDirectory(this.baseSessionPath);
	}

	async logEventDate() {
		// Log the event date.
		const lines = [];
		lines.push(`Time: ${time} | Id: ${id} | Post Id: ${postId ? postId : this.emptyValue} | Creation Date Time: ${displayCreationDateTime}`);
		lines.push(`Publish Date: ${publishDate} | Price Number: ${displayPriceNumber} | Price Display: ${displayPriceDisplay} | Coupon Key: ${couponKey}`);
		lines.push(`Status: ${displayStatus} | Page Number: ${pageNumber} | Index Page Number: ${indexPageNumber} | Type: ${type} | Is Free: ${isFree}`);
		lines.push(`Name: ${name}`);
		lines.push(`Course URL: ${displayCourseURL}`);
		lines.push(`Udemy URL: ${displayUdemyURL}`);
		lines.push(`Result Details: ${displayResultDetails}`);
		lines.push(`${this.logSeparator}${isLog ? '\n' : ''}`);
		lines.join('\n');
		await fileUtils.appendFile({
			targetPath: path,
			message: message
		});
	}
}

module.exports = new LogService();
/* 	createEventDates() {
		const { itemPath, resultsList } = checkResults;
		const lines = [];
		lines.push(itemPath);
		for (let i = 0; i < resultsList.length; i++) {
			const { fix, suggestions } = resultsList[i];
			if (!fix || !validationUtils.isExists(suggestions)) {
				continue;
			}
			lines.push(`${fix} => ${suggestions.join(', ')}`);
		}
		lines.push(`${this.logSeparator}\n`);
		return lines.join('\n');
	} */

/* const { LogData } = require('../../core/models');
const { Color, Placeholder, StatusIcon } = require('../../core/enums');
const { ignorePaths, ignoreWords } = require('../../configurations');
const applicationService = require('./application.service');
const countLimitService = require('./countLimit.service');
const itemService = require('./item.service');
const pathService = require('./path.service');
const { fileUtils, logUtils, pathUtils, textUtils, timeUtils, validationUtils } = require('../../utils'); */


	/* 	constructor() {
			this.logData = null;
			this.logInterval = null;
			// ===PATH=== //
			this.baseSessionPath = null;
			this.sessionDirectoryPath = null;
			this.itemResultsPath = null;
			this.frames = ['-', '\\', '|', '/'];
			this.i = 0;
			this.emptyValue = '##';
			this.logSeparator = '==========';
			this.directoryIndex = null;
			this.fileIndex = null;
			this.logCounts = 0;
		}

		initiate(settings) {
			this.logData = new LogData(settings);
			this.initiateDirectories();
		}

		initiateDirectories() {
			// ===PATH=== //
			if (!this.logData.isLogResults) {
				return;
			}
			this.baseSessionPath = pathService.pathData.distPath;
			fileUtils.createDirectory(this.baseSessionPath);
			this.getNextDirectoryIndex();
			this.createSessionDirectory();
		}

		createSessionDirectory() {
			this.sessionDirectoryPath = pathUtils.getJoinPath({
				targetPath: this.baseSessionPath,
				targetName: `${this.directoryIndex}_${applicationService.applicationData.logDateTime}`
			});
			fileUtils.createDirectory(this.sessionDirectoryPath);
			this.updateFileName();
		}

		updateFileName() {
			if (this.directoryIndex) {
				this.fileIndex++;
			}
			else {
				this.fileIndex = 1;
			}
			this.itemResultsPath = this.createFilePath(`${this.fileIndex}_${textUtils.toLowerCase(applicationService.applicationData.method)}_${Placeholder.DATE}`);
		}

		createFilePath(fileName) {
			return pathUtils.getJoinPath({
				targetPath: this.sessionDirectoryPath ? this.sessionDirectoryPath : pathService.pathData.distPath,
				targetName: `${fileName.replace(Placeholder.DATE, applicationService.applicationData.logDateTime)}.txt`
			});
		}

		getNextDirectoryIndex() {
			const directories = fileUtils.getAllDirectories(this.baseSessionPath);
			if (!validationUtils.isExists(directories)) {
				this.directoryIndex = 1;
				return;
			}
			this.directoryIndex = Math.max(...directories.map(name => textUtils.getSplitNumber(name))) + 1;
		}

		startLogProgress() {
			// Start the process for the first interval round.
			this.logInterval = setInterval(() => {
				// Update the current time of the process.
				const time = timeUtils.getDifferenceTimeBetweenDates({
					startDateTime: applicationService.applicationData.startDateTime,
					endDateTime: new Date()
				});
				applicationService.applicationData.time = time;
				// Log the status console each interval round.
				this.logProgress();
			}, countLimitService.countLimitData.millisecondsIntervalCount);
		}

		getDisplayItem(itemName) {
			return textUtils.cutText({ text: itemName, count: countLimitService.countLimitData.maximumItemNamePathCharactersDisplayCount });
		}

		logProgress() {
			const time = `${applicationService.applicationData.time} [${this.frames[this.i = ++this.i % this.frames.length]}]`;
			const currentPercentage = textUtils.calculatePercentageDisplay({ partialValue: applicationService.applicationData.itemIndex, totalValue: itemService.itemData.totalItemsCount });
			const current = textUtils.getNumberOfNumber({ number1: applicationService.applicationData.itemIndex, number2: itemService.itemData.totalItemsCount });
			const currentItem = `${current} (${currentPercentage})`;
			const scanItemsCount = `${StatusIcon.V}  ${textUtils.getNumberWithCommas(itemService.itemData.scanItemsCount)}`;
			const misspellItemsCount = `${StatusIcon.X}  ${textUtils.getNumberWithCommas(itemService.itemData.misspellItemsCount)}`;
			const itemName = this.getDisplayItem(applicationService.applicationData.itemName);
			const itemDirectoryPath = this.getDisplayItem(applicationService.applicationData.itemDirectoryPath);
			const scanPath = this.getDisplayItem(applicationService.applicationData.scanPath);
			logUtils.logProgress({
				titlesList: ['SETTINGS', 'GENERAL', 'ITEMS', 'WORDS', 'NAME', 'PATH', 'SCAN PATH'],
				colorsTitlesList: [Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE, Color.BLUE],
				keysLists: [{
					'Time': time,
					'Method': applicationService.applicationData.method,
					'Ignore Words': ignoreWords.length,
					'Ignore Paths': ignorePaths.length
				}, {
					'Current': currentItem,
					'Status': applicationService.applicationData.status
				}, {
					'Total': scanItemsCount,
					'Misspell': misspellItemsCount,
					'Skip': itemService.itemData.skipItemsCount,
					'Error': itemService.itemData.errorItemsCount
				}, {
					'Total': itemService.itemData.scanWordsCount,
					'Misspell': itemService.itemData.misspellWordsCount
				}, {
					'#': itemName
				}, {
					'#': itemDirectoryPath
				}, {
					'#': scanPath
				}],
				colorsLists: [
					[Color.YELLOW, Color.YELLOW, Color.YELLOW, Color.YELLOW],
					[Color.YELLOW, Color.YELLOW],
					[Color.GREEN, Color.RED, Color.CYAN, Color.CYAN],
					[Color.GREEN, Color.RED],
					[],
					[],
					[]
				],
				nonNumericKeys: {},
				statusColor: Color.CYAN
			});
		}

		createEmailTemplate(checkResults) {
			const { itemPath, resultsList } = checkResults;
			const lines = [];
			lines.push(itemPath);
			for (let i = 0; i < resultsList.length; i++) {
				const { fix, suggestions } = resultsList[i];
				if (!fix || !validationUtils.isExists(suggestions)) {
					continue;
				}
				lines.push(`${fix} => ${suggestions.join(', ')}`);
			}
			lines.push(`${this.logSeparator}\n`);
			return lines.join('\n');
		}

		updateSessionDirectoryPath() {
			this.logCounts++;
			if (this.logCounts % countLimitService.countLimitData.maximumLogsCountPerFile === 0) {
				this.updateFileName();
			}
		}

		async logCheckResults(checkResults) {
			if (!this.logData.isLogResults) {
				return;
			}
			const message = this.createEmailTemplate(checkResults);
			await fileUtils.appendFile({
				targetPath: this.itemResultsPath,
				message: message
			});
			this.updateSessionDirectoryPath();
		}

		createLineTemplate(title, value) {
			return textUtils.addBreakLine(`${logUtils.logColor(`${title}:`, Color.MAGENTA)} ${value}`);
		}

		createConfirmSettingsTemplate(settings) {
			const parameters = ['METHOD', 'MODE', 'SCAN_PATH'];
			let settingsText = '';
			settingsText += Object.keys(settings).filter(s => parameters.indexOf(s) > -1)
				.map(k => this.createLineTemplate(k, settings[k])).join('');
			settingsText = textUtils.removeLastCharacter(settingsText);
			return `${textUtils.setLogStatus('IMPORTANT SETTINGS')}
	${settingsText}
	========================
	OK to run? (y = yes)`;
		}

		close() {
			if (this.logInterval) {
				clearInterval(this.logInterval);
			}
		} */