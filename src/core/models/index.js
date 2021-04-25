const ApplicationDataModel = require('./files/ApplicationData.model');
const BackupDataModel = require('./files/BackupData.model');
const BackupDirectoryModel = require('./files/BackupDirectory.model');
const CalendarDayModel = require('./files/CalendarDay.model');
const CommonTaskModel = require('./files/CommonTask.model');
const CountLimitDataModel = require('./files/countLimitData.model');
const DynamicEventDateModel = require('./files/DynamicEventDate.model');
const EventDateModel = require('./files/EventDate.model');
const LogDataModel = require('./files/LogData.model');
const MissingEventDateModel = require('./files/MissingEventDate.model');
const PathDataModel = require('./files/PathData.model');
const RepeatEventDateModel = require('./files/RepeatEventDate.model');
const SourceEventResultModel = require('./files/SourceEventResult.model');
const ValidateSourceEventTypeResultModel = require('./files/ValidateSourceEventTypeResult.model');

module.exports = {
    ApplicationDataModel, BackupDataModel, BackupDirectoryModel, CalendarDayModel, CommonTaskModel, CountLimitDataModel,
    DynamicEventDateModel, EventDateModel, LogDataModel, MissingEventDateModel, PathDataModel, RepeatEventDateModel,
    SourceEventResultModel, ValidateSourceEventTypeResultModel
};