import textUtils from './text.utils.js';

class LogUtils {
  constructor() {}

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

export default new LogUtils();
