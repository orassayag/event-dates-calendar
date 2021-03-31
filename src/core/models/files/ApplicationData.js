const { timeUtils } = require('../../../utils');

class ApplicationData {

	constructor(data) {
		// Set the parameters from the settings file.
		const { settings, status } = data;
		const { YEAR, CALENDAR_LINK, VALIDATION_CONNECTION_LINK } = settings;
		this.year = YEAR;
		this.calendarURL = CALENDAR_LINK;
		this.validationConnectionLink = VALIDATION_CONNECTION_LINK;
		this.status = status;
		this.startDateTime = null;
		this.time = null;
		this.logDateTime = timeUtils.getFullDateNoSpaces();
	}
}

module.exports = ApplicationData;