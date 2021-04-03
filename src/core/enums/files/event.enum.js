const enumUtils = require('../enum.utils');

const EventType = enumUtils.createEnum([
    ['INITIATE', 'initiate'],
    ['SERVICE', 'service'],
    ['BIRTHDAY', 'birthday'],
    ['CALENDAR', 'calendar'],
    ['STATIC', 'static'],
    ['DAILY_TASK', 'dailyTask'],
    ['WEEKEND_TASK', 'weekendTask'],
    ['WEEKEND_TOGGLE_TASK', 'weekendToggleTask'],
    ['COMPLETE_CANCEL_TASK', 'completeCancelTask'],
    ['DATA', 'data'],
    ['END', 'end']
]);

module.exports = { EventType };