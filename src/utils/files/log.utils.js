const textUtils = require('./text.utils');

class LogUtils {

    constructor() { }

    log(message) {
        console.log(message);
    }

    logStatus(status) {
        if (!status) {
            return '';
        }
        this.log(textUtils.setLogStatus(status));
    }
}

module.exports = new LogUtils();