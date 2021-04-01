const ApplicationData = require('./files/ApplicationData');
const BackupData = require('./files/BackupData');
const BackupDirectory = require('./files/BackupDirectory');
const CalendarDay = require('./files/CalendarDay');
const CountLimitData = require('./files/CountLimitData');
const EventDate = require('./files/EventDate');
const LogData = require('./files/LogData');
const MissingEventDate = require('./files/MissingEventDate');
const PathData = require('./files/PathData');
const SourceEventResult = require('./files/SourceEventResult');

module.exports = {
    ApplicationData, BackupData, BackupDirectory, CalendarDay, CountLimitData,
    EventDate, LogData, MissingEventDate, PathData, SourceEventResult
};
/* const Holiday = require('./files/Holiday'); */
/* class Holiday {

	constructor(data) {
        const { id, day, month, matchText, displayText, holidayEveId } = data;
        this.id = id;
        this.day = day;
        this.month = month;
        this.matchText = matchText;
        this.displayText = displayText;
        this.holidayEveId = holidayEveId;
    }
}

module.exports = Holiday; */