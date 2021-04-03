const logUtils = require('./log.utils');

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

module.exports = new SystemUtils();