/* cSpell:disable */
const { DynamicEventDate, EventDate, MissingEventDate, RepeatEventDate } = require('../../core/models');
const { EventType } = require('../../core/enums');

class EventCulture {

    constructor() { }

    createStaticEventDates() {
        return [
            new EventDate({
                id: null,
                day: 1,
                month: 1,
                year: null,
                eventType: EventType.STATIC,
                text: 'ראש השנה הלועזית החדשה'
            }),
            new EventDate({
                id: null,
                day: 27,
                month: 1,
                year: null,
                eventType: EventType.STATIC,
                text: 'יום השואה הבינלאומי'
            }),
            new EventDate({
                id: null,
                day: 14,
                month: 2,
                year: null,
                eventType: EventType.STATIC,
                text: 'יום ולנטיין'
            }),
            new EventDate({
                id: null,
                day: 8,
                month: 3,
                year: null,
                eventType: EventType.STATIC,
                text: 'יום האישה הבינלאומי'
            }),
            new EventDate({
                id: null,
                day: 1,
                month: 4,
                year: null,
                eventType: EventType.STATIC,
                text: 'אחד באפריל - יום השוטים הבינלאומי'
            }),
            new EventDate({
                id: null,
                day: 1,
                month: 5,
                year: null,
                eventType: EventType.STATIC,
                text: 'חג הפועלים הבינלאומי'
            }),
            new EventDate({
                id: null,
                day: 8,
                month: 5,
                year: null,
                eventType: EventType.STATIC,
                text: 'יום הניצחון באירופה במלחמת העולם השנייה'
            }),
            new EventDate({
                id: null,
                day: 14,
                month: 5,
                year: null,
                eventType: EventType.STATIC,
                text: 'יום הקמת מדינת ישראל'
            }),
            new EventDate({
                id: null,
                day: 6,
                month: 6,
                year: null,
                eventType: EventType.STATIC,
                text: 'יום הפלישה לנורמנדי - D-Day'
            }),
            new EventDate({
                id: null,
                day: 4,
                month: 7,
                year: null,
                eventType: EventType.STATIC,
                text: 'יום העצמאות של ארה"ב'
            }),
            new EventDate({
                id: null,
                day: 1,
                month: 9,
                year: null,
                eventType: EventType.STATIC,
                text: 'יום התחלת מלחמת העולם השנייה'
            }),
            new EventDate({
                id: null,
                day: 1,
                month: 9,
                year: null,
                eventType: EventType.STATIC,
                text: 'יום תחילת שנת הלימודים בבתי הספר'
            }),
            new EventDate({
                id: null,
                day: 11,
                month: 9,
                year: null,
                eventType: EventType.STATIC,
                text: 'יום הזיכרון לפיגוע התיאומים'
            }),
            new EventDate({
                id: null,
                day: 4,
                month: 11,
                year: null,
                eventType: EventType.STATIC,
                text: 'יום הזיכרון הרשמי לרצח רבין'
            }),
            new EventDate({
                id: null,
                day: 31,
                month: 12,
                year: null,
                eventType: EventType.STATIC,
                text: 'ערב השנה החדשה - הסילבסטר'
            })
        ];
    }

    createMissingEventDates() {
        return [
            new MissingEventDate({
                id: 1,
                includeText: 'אילנות',
                excludeText: null,
                displayText: null,
                isDayBefore: true
            }),
            new MissingEventDate({
                id: 2,
                includeText: 'שביעי של פסח',
                excludeText: null,
                displayText: 'מימונה',
                isDayBefore: false
            }),
            new MissingEventDate({
                id: 3,
                includeText: 'שואה',
                excludeText: null,
                displayText: null,
                isDayBefore: true
            }),
            new MissingEventDate({
                id: 4,
                includeText: 'זכרון',
                excludeText: 'שואה',
                displayText: null,
                isDayBefore: true
            }),
            new MissingEventDate({
                id: 5,
                includeText: 'עצמאות',
                excludeText: null,
                displayText: null,
                isDayBefore: true
            }),
            new MissingEventDate({
                id: 6,
                includeText: 'ט"ו באב',
                excludeText: null,
                displayText: null,
                isDayBefore: true
            })
        ];
    }

    createDynamicEventDates() {
        return [
            new DynamicEventDate({
                id: 1,
                includeText: 'Black Friday',
                displayText: 'יום שישי השחור - בלאק פריידיי'
            }),
            new DynamicEventDate({
                id: 2,
                includeText: 'Cyber Monday',
                displayText: 'שני הסייבר - סייבר מאנדיי'
            })
        ];
    }

    createRepeatEventDates() {
        return [
            new RepeatEventDate({
                id: 1,
                day: 13,
                dayInWeek: 5,
                displayText: 'יום שישי ה-13'
            })
        ];
    }
}

module.exports = new EventCulture();