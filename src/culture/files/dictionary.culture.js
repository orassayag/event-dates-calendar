/* cSpell:disable */

class DictionaryCulture {

    constructor() {
        this.englishDaysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.hebrewDaysList = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        this.hebrewBirthDay = 'יום הולדת ל';
        this.eveNight = 'ערב';
    }
}

module.exports = new DictionaryCulture();
/*     reverse(text) {
        if (!text) {
            return '';
        }
        return [...text].reverse().join('');
    } */
/* this.reverse('יום הולדת ל'); */
/* .map(d => this.reverse(d)); */
/* const { textUtils } = require('../utils'); */
/* cSpell:disable */
/* const { Holiday } = require('../core/models');

class Holidays {

    constructor() {
        this.holidaysList = [
            new Holiday({
                id: 1,
                day: 1,
                month: 1,
                matchText: null,
                displayText: 'ראש השנה הלועזית החדשה',
                holidayEveId: null
            }),
            new Holiday({
                id: 2,
                day: null,
                month: null,
                matchText: 'ראש השנה לאילנות',
                holidayEveId: 3
            }),
            new Holiday({
                id: 5,
                day: 8,
                month: 3,
                matchText: null,
                displayText: 'יום האישה הבינלאומי',
                holidayEveId: null
            })
        ];
    }
}

module.exports = new Holidays(); */