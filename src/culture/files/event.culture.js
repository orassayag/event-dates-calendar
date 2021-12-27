/* cSpell:disable */
import {
    DynamicEventDateModel, EventDateModel, MissingEventDateModel,
    RepeatEventDateModel, ReplaceEventDateModel
} from '../../core/models';
import { EventTypeEnum } from '../../core/enums';

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

    createReplaceEventDates() {
        return [
            new ReplaceEventDateModel({
                id: 1,
                include: `א דחוה'מ`,
                replace: `א' דחוה"מ`
            }),
            new ReplaceEventDateModel({
                id: 2,
                include: `ב דחוה'מ`,
                replace: `ב' דחוה"מ`
            }),
            new ReplaceEventDateModel({
                id: 3,
                include: `ג דחוה'מ`,
                replace: `ג' דחוה"מ`
            }),
            new ReplaceEventDateModel({
                id: 4,
                include: `ד דחוה'מ`,
                replace: `ד' דחוה"מ`
            }),
            new ReplaceEventDateModel({
                id: 5,
                include: `ה דחוה'מ`,
                replace: `ה' דחוה"מ`
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
                includeText: 'הושענא רבה',
                excludeText: null,
                displayText: 'ערב חג סוכות שני',
                isDayBefore: false
            }),
            new MissingEventDateModel({
                id: 4,
                includeText: 'שואה',
                excludeText: null,
                displayText: null,
                isDayBefore: true
            }),
            new MissingEventDateModel({
                id: 5,
                includeText: 'זכרון',
                excludeText: 'שואה',
                displayText: null,
                isDayBefore: true
            }),
            new MissingEventDateModel({
                id: 6,
                includeText: 'עצמאות',
                excludeText: null,
                displayText: null,
                isDayBefore: true
            }),
            new MissingEventDateModel({
                id: 7,
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

export default new EventCulture();