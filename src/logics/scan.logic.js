const settings = require('../settings/settings');
const { StatusEnum } = require('../core/enums');
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
        this.updateStatus('INITIATE THE SERVICES', StatusEnum.INITIATE);
        pathService.initiate(settings);
        await logService.initiate(settings);
    }

    validateGeneralSettings() {
        this.updateStatus('VALIDATE GENERAL SETTINGS', StatusEnum.VALIDATE);
        // Validate that the internet connection works.
        countLimitService.initiate(settings);
        applicationService.initiate(settings, StatusEnum.INITIATE);
    }

    async startSession() {
        this.updateStatus('SCAN TEXT FILE', StatusEnum.SCAN);
        applicationService.applicationDataModel.startDateTime = timeUtils.getCurrentDate();
        await eventService.scanSourceFile();
        await this.exit(StatusEnum.FINISH);
    }

    async sleep() {
        await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsEndDelayCount);
    }

    updateStatus(text, status) {
        logUtils.logStatus(text);
        if (applicationService.applicationDataModel) {
            applicationService.applicationDataModel.status = status;
        }
    }

    async exit(status) {
        if (applicationService.applicationDataModel) {
            applicationService.applicationDataModel.status = status;
            await this.sleep();
        }
        logUtils.logStatus(status);
    }
}

module.exports = ScanLogic;