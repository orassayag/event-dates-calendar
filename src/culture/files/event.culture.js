/* cSpell:disable */
const { DynamicEventDateModel, EventDateModel, MissingEventDateModel, RepeatEventDateModel } = require('../../core/models');
const { EventTypeEnum } = require('../../core/enums');

class EventCulture {

    constructor() { }

    createStaticEventDates() {
        return [
            new EventDateModel({
                id: null,
                day: 1,
                month: 1,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'ראש השנה הלועזית החדשה'
            }),
            new EventDateModel({
                id: null,
                day: 27,
                month: 1,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'יום השואה הבינלאומי'
            }),
            new EventDateModel({
                id: null,
                day: 14,
                month: 2,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'יום ולנטיין'
            }),
            new EventDateModel({
                id: null,
                day: 8,
                month: 3,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'יום האישה הבינלאומי'
            }),
            new EventDateModel({
                id: null,
                day: 1,
                month: 4,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'אחד באפריל - יום השוטים הבינלאומי'
            }),
            new EventDateModel({
                id: null,
                day: 1,
                month: 5,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'חג הפועלים הבינלאומי'
            }),
            new EventDateModel({
                id: null,
                day: 8,
                month: 5,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'יום הניצחון באירופה במלחמת העולם השנייה'
            }),
            new EventDateModel({
                id: null,
                day: 14,
                month: 5,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'יום הקמת מדינת ישראל'
            }),
            new EventDateModel({
                id: null,
                day: 6,
                month: 6,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'יום הפלישה לנורמנדי - D-Day'
            }),
            new EventDateModel({
                id: null,
                day: 4,
                month: 7,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'יום העצמאות של ארה"ב'
            }),
            new EventDateModel({
                id: null,
                day: 1,
                month: 9,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'יום התחלת מלחמת העולם השנייה'
            }),
            new EventDateModel({
                id: null,
                day: 1,
                month: 9,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'יום תחילת שנת הלימודים בבתי הספר'
            }),
            new EventDateModel({
                id: null,
                day: 11,
                month: 9,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'יום הזיכרון לפיגוע התיאומים'
            }),
            new EventDateModel({
                id: null,
                day: 4,
                month: 11,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'יום הזיכרון הרשמי לרצח רבין'
            }),
            new EventDateModel({
                id: null,
                day: 31,
                month: 12,
                year: null,
                eventType: EventTypeEnum.STATIC,
                text: 'ערב השנה החדשה - הסילבסטר'
            })
        ];
    }

    createMissingEventDates() {
        return [
            new MissingEventDateModel({
                id: 1,
                includeText: 'אילנות',
                excludeText: null,
                displayText: null,
                isDayBefore: true
            }),
            new MissingEventDateModel({
                id: 2,
                includeText: 'שביעי של פסח',
                excludeText: null,
                displayText: 'מימונה',
                isDayBefore: false
            }),
            new MissingEventDateModel({
                id: 3,
                includeText: 'שואה',
                excludeText: null,
                displayText: null,
                isDayBefore: true
            }),
            new MissingEventDateModel({
                id: 4,
                includeText: 'זכרון',
                excludeText: 'שואה',
                displayText: null,
                isDayBefore: true
            }),
            new MissingEventDateModel({
                id: 5,
                includeText: 'עצמאות',
                excludeText: null,
                displayText: null,
                isDayBefore: true
            }),
            new MissingEventDateModel({
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
            new DynamicEventDateModel({
                id: 1,
                includeText: 'Black Friday',
                displayText: 'יום שישי השחור - בלאק פריידיי'
            }),
            new DynamicEventDateModel({
                id: 2,
                includeText: 'Cyber Monday',
                displayText: 'שני הסייבר - סייבר מאנדיי'
            })
        ];
    }

    createRepeatEventDates() {
        return [
            new RepeatEventDateModel({
                id: 1,
                day: 13,
                dayInWeek: 5,
                displayText: 'יום שישי ה-13'
            })
        ];
    }
}

module.exports = new EventCulture();