const applicationService = require('./files/application.service');
const calenderService = require('./files/calender.service');
const confirmationService = require('./files/confirmation.service');
const countLimitService = require('./files/countLimit.service');
const eventService = require('./files/event.service');
const logService = require('./files/log.service');
const pathService = require('./files/path.service');
const validationService = require('./files/validation.service');

module.exports = {
    applicationService, calenderService, confirmationService, countLimitService,
    eventService, logService, pathService, validationService
};