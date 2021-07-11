/* cSpell:disable */

class DictionaryCulture {

    constructor() {
        this.englishDaysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.hebrewDaysList = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        this.hebrewBirthDay = 'יום הולדת ל';
        this.hebrewDeathDay = 'יום פטירת ';
        this.eveNight = 'ערב';
    }
}

module.exports = new DictionaryCulture();