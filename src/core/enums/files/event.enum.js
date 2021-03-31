const enumUtils = require('../enum.utils');

/* const LineType = enumUtils.createEnum([
    ['DATA', 'data'],
    ['EVENTS', 'events']
]); */

const EventType = enumUtils.createEnum([
    ['INITIATE', 'initiate'],
    ['SERVICE', 'service'],
    ['BIRTHDAY', 'birthday'],
    ['CALENDAR', 'calendar'],
    ['DAILY_TASK', 'daily_task'],
    ['DATA', 'data']
]);

module.exports = { EventType/* , LineType */};