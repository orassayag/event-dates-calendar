const { timeUtils } = require('../../../utils');

class ApplicationDataModel {

	constructor(data) {
		// Set the parameters from the settings file.
		const { settings, status } = data;
		const { YEAR, CALENDAR_IL_LINK, CALENDAR_US_LINK, VALIDATION_CONNECTION_LINK } = settings;
		this.year = parseInt(YEAR);
		this.calendarILLink = `${CALENDAR_IL_LINK}${YEAR}`;
		this.calendarUSLink = `${CALENDAR_US_LINK}${YEAR}`;
		this.validationConnectionLink = VALIDATION_CONNECTION_LINK;
		this.status = status;
		this.startDateTime = null;
		this.time = null;
		this.logDateTime = timeUtils.getFullDateNoSpaces();
	}
}

module.exports = ApplicationDataModel;