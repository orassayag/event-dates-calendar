const applicationService = require('./files/application.service');
const confirmationService = require('./files/confirmation.service');
const countLimitService = require('./files/countLimit.service');
const logService = require('./files/log.service');
const pathService = require('./files/path.service');
const validationService = require('./files/validation.service');

module.exports = {
    applicationService, confirmationService, countLimitService, logService,
    pathService, validationService
};