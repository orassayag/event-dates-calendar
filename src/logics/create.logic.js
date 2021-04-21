const settings = require('../settings/settings');
const { Status } = require('../core/enums');
const { applicationService, confirmationService, countLimitService, eventService, logService,
    pathService, validationService } = require('../services');
const globalUtils = require('../utils/files/global.utils');
const { logUtils, systemUtils, timeUtils } = require('../utils');

class CreateLogic {

    constructor() { }

    async run() {
        // Validate all settings are fit to the user needs.
        await this.confirm();
        // Validate general settings.
        await this.validateGeneralSettings();
        // Initiate all the settings, configurations, services, etc...
        await this.initiate();
        // Start the create calendar process.
        await this.startSession();
    }

    async initiate() {
        this.updateStatus('INITIATE THE SERVICES', Status.INITIATE);
        pathService.initiate(settings);
        await logService.initiate(settings);
    }

    async validateGeneralSettings() {
        this.updateStatus('VALIDATE GENERAL SETTINGS', Status.VALIDATE);
        // Validate that the internet connection works.
        countLimitService.initiate(settings);
        applicationService.initiate(settings, Status.INITIATE);
        // Validate that the internet connection works.
        await validationService.validateURLs();
    }

    async startSession() {
        this.updateStatus('CREATE TEXT FILE', Status.CREATE);
        applicationService.applicationData.startDateTime = timeUtils.getCurrentDate();
        await eventService.createEventDates();
        await this.exit(Status.FINISH);
    }

    async sleep() {
        await globalUtils.sleep(countLimitService.countLimitData.millisecondsEndDelayCount);
    }

    // Let the user confirm all the IMPORTANT settings before the process starts.
    async confirm() {
        if (!await confirmationService.confirm(settings)) {
            await this.exit(Status.ABORT_BY_THE_USER);
        }
    }

    updateStatus(text, status) {
        logUtils.logStatus(text);
        if (applicationService.applicationData) {
            applicationService.applicationData.status = status;
        }
    }

    async exit(status) {
        if (applicationService.applicationData) {
            applicationService.applicationData.status = status;
            await this.sleep();
        }
        systemUtils.exit(status);
    }
}

module.exports = CreateLogic;