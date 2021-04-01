const enumUtils = require('../enum.utils');

const EventType = enumUtils.createEnum([
    ['INITIATE', 'initiate'],
    ['SERVICE', 'service'],
    ['BIRTHDAY', 'birthday'],
    ['CALENDAR', 'calendar'],
    ['STATIC', 'static'],
    ['DAILY_TASK', 'dailyTask'],
    ['COMPLETE_CANCEL_TASK', 'completeCancelTask'],
    ['DATA', 'data'],
    ['END', 'end']
]);

module.exports = { EventType };
/* , LineType */
/* const LineType = enumUtils.createEnum([
    ['DATA', 'data'],
    ['EVENTS', 'events']
]); */
