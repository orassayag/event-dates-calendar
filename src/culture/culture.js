/* cSpell:disable */

class Culture {

    constructor() {
        this.englishDaysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.hebrewDaysList = ['שבת', 'שישי', 'חמישי', 'רביעי', 'שלישי', 'שני', 'ראשון']; /* .map(d => this.reverse(d)); */
        this.hebrewBirthDay = 'יום הולדת ל'; /* this.reverse('יום הולדת ל'); */
    }

    reverse(text) {
        if (!text) {
            return '';
        }
        return [...text].reverse().join('');
    }
}

module.exports = new Culture();
/* const { textUtils } = require('../utils'); */