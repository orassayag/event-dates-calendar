/* cSpell:disable */

class DictionaryCulture {

    constructor() {
        this.englishDaysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.hebrewDaysList = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        this.hebrewBirthDay = 'יום הולדת ל';
        this.hebrewDeathDay = 'יום פטירת ';
        this.eveNight = 'ערב';
        this.vacation = `חופש`;
    }

    getVacationDays() {
        return [
            'ערב פסח',
            'פסח',
            'ערב שבועות',
            'שבועות',
            'ערב ראש השנה',
            'ראש השנה',
            'ערב יום כיפור',
            'יום כיפור',
            'ערב סוכות',
            'סוכות'
        ];
    }
}

export default new DictionaryCulture();