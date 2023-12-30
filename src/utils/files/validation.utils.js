import regexUtils from './regex.utils.js';

class ValidationUtils {
  constructor() {}

  // This method validates if a given value is a valid number and returns the result.
  isValidNumber(number) {
    number = Number(number);
    return !isNaN(number) && typeof number == 'number';
  }

  isPositiveNumber(number) {
    if (!this.isValidNumber(number)) {
      return false;
    }
    return Number(number) > 0;
  }

  isValidArray(variable) {
    return Object.prototype.toString.call(variable) === '[object Array]';
  }

  isExists(list) {
    return list && list.length > 0;
  }

  // This method validates that a given string exists in an array list of specific types.
  isValidEnum(data) {
    // Validate the existence and validity of the data parameters. If not exists, return false.
    if (!data || !data.enum || !data.value) {
      return false;
    }
    // Check if the value exists within a given array. Return false if not.
    return Object.values(data.enum).indexOf(data.value) > -1;
  }

  isValidDate(dateTime) {
    return dateTime instanceof Date;
  }

  isValidLink(link) {
    return regexUtils.validateLinkRegex.test(link);
  }

  isIndexExists(list, index) {
    return typeof list[index] !== 'undefined';
  }
}

export default new ValidationUtils();
