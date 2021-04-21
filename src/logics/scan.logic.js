const settings = require('../settings/settings');
const { Status } = require('../core/enums');
const { applicationService, countLimitService, eventService, logService, pathService } = require('../services');
const globalUtils = require('../utils/files/global.utils');
const { logUtils, timeUtils } = require('../utils');

class ScanLogic {

    constructor() { }

    async run() {
        // Validate general settings.
        this.validateGeneralSettings();
        // Initiate all the settings, configurations, services, etc...
        await this.initiate();
        // Start the scan event dates TXT file process.
        await this.startSession();
    }

    async initiate() {
        this.updateStatus('INITIATE THE SERVICES', Status.INITIATE);
        pathService.initiate(settings);
        await logService.initiate(settings);
    }

    validateGeneralSettings() {
        this.updateStatus('VALIDATE GENERAL SETTINGS', Status.VALIDATE);
        // Validate that the internet connection works.
        countLimitService.initiate(settings);
        applicationService.initiate(settings, Status.INITIATE);
    }

    async startSession() {
        this.updateStatus('SCAN TEXT FILE', Status.SCAN);
        applicationService.applicationData.startDateTime = timeUtils.getCurrentDate();
        await eventService.scanSourceFile();
        await this.exit(Status.FINISH);
    }

    async sleep() {
        await globalUtils.sleep(countLimitService.countLimitData.millisecondsEndDelayCount);
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
        logUtils.logStatus(status);
    }
}

module.exports = ScanLogic;