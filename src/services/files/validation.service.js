import isReachable from 'is-reachable';
import applicationService from './application.service';
import countLimitService from './countLimit.service';
import globalUtils from '../../utils/files/global.utils';

class ValidationService {

    constructor() { }

    async validateURLs() {
        const urls = [applicationService.applicationDataModel.validationConnectionLink, applicationService.applicationDataModel.calendarILLink,
        applicationService.applicationDataModel.calendarUSLink];
        for (let i = 0; i < urls.length; i++) {
            await this.validateURL(urls[i]);
        }
    }

    async validateURL(url) {
        let isConnected = true;
        for (let i = 0; i < countLimitService.countLimitDataModel.maximumURLValidationCount; i++) {
            try {
                isConnected = await isReachable(url);
            } catch (error) {
                isConnected = false;
            }
            if (isConnected) {
                break;
            }
            else {
                await globalUtils.sleep(countLimitService.countLimitDataModel.millisecondsTimeoutURLValidation);
            }
        }
        if (!isConnected) {
            throw new Error(`${url} is not available (1000015)`);
        }
    }
}

export default new ValidationService();