import validationUtils from './validation.utils.js';

class TextUtils {
  constructor() {
    this.b = '===';
  }

  setLogStatus(status) {
    if (!status) {
      return '';
    }
    return `${this.b}${status}${this.b}`;
  }

  // This method adds leading 0 if needed.
  addLeadingZero(number) {
    if (!validationUtils.isValidNumber(number)) {
      return '';
    }
    return number < 10 ? `0${number}` : number;
  }

  getBackupName(data) {
    const { applicationName, date, title, index } = data;
    return `${applicationName}_${date}-${index + 1}${title ? `-${title}` : ''}`;
  }

  removeAllCharacters(text, target) {
    if (!text) {
      return '';
    }
    return text.split(target).join('');
  }

  toLowerCase(text) {
    if (!text) {
      return '';
    }
    return text.toLowerCase();
  }

  addBackslash(text) {
    if (!text) {
      return '';
    }
    return `${text}/`;
  }

  removeLastCharacters(data) {
    const { value, charactersCount } = data;
    if (!value || !validationUtils.isValidNumber(charactersCount)) {
      return '';
    }
    return value.substring(0, value.length - charactersCount);
  }

  addBreakLine(text) {
    return `${text}\r\n`;
  }
}

export default new TextUtils();
