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
    ['DAILY_TASK', 'dailyTask'],
    ['WEEKEND_TASK', 'weekendTask'],
    ['WEEKEND_TOGGLE_TASK', 'weekendToggleTask'],
    ['MONTHLY_TASK', 'monthlyTask'],
    ['HALF_YEARLY_TASK', 'halfYearlyTask'],
    ['COMPLETE_CANCEL_TASK', 'completeCancelTask'],
    ['DATA', 'data'],
    ['END', 'end']
]);

export { EventTypeEnum };