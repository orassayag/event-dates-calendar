/* cSpell:disable */
const { EventDate, MissingEventDate } = require('../../core/models');
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
}

module.exports = new EventCulture();