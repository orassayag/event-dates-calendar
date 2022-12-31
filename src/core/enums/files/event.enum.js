import enumUtils from '../enum.utils';

const EventTypeEnum = enumUtils.createEnum([
    ['INITIATE', 'initiate'],
    ['SERVICE', 'service'],
    ['BIRTHDAY', 'birthday'],
    ['DEATHDAY', 'deathday'],
    ['CALENDAR', 'calendar'],
    ['STATIC', 'static'],
    ['DYNAMIC', 'dynamic'],
    ['REPEAT', 'repeat'],
    ['DAY_TASK', 'dayTask'],
    ['WEEKEND_TASK', 'weekendTask'],
    ['WEEKEND_TOGGLE_TASK', 'weekendToggleTask'],
    ['END_MONTH_TASK', 'endMonthTask'],
    ['HALF_YEAR_TASK', 'halfYearTask'],
    ['YEAR_TASK', 'yearTask'],
    ['END_YEAR_TASK', 'endYearTask'],
    ['FUTURE_TASK', 'futureTask'],
    ['START_EVENTS', 'startEvents'],
    ['COMPLETE_CANCEL_TASK', 'completeCancelTask'],
    ['DATA', 'data'],
    ['END', 'end']
]);

export { EventTypeEnum };