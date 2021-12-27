import logUtils from './log.utils';

class SystemUtils {

    constructor() { }

    exit(exitReason) {
        logUtils.logStatus(this.getExitReason(exitReason));
        process.exit(0);
    }

    getExitReason(exitReason) {
        if (!exitReason) {
            return '';
        }
        return `EXIT: ${exitReason}`;
    }
}

export default new SystemUtils();