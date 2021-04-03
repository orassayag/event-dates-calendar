class SeparatorService {

    constructor() {
        // ===EVENT=== //
        this.startLineCharacter = '-';
        this.endLineCharacter = '*';
        // ===FILE=== //
        this.eventTypeSeparator = '=';
        this.toggleSeparator = '+';
        this.dummySeparator = '^';
        this.completeCancelTasksSeparator = '#@';
        this.dailyTasksSeparator = '!@';
        this.weekendTasksSeparator = '&@';
        this.weekendToggleTasksSeparator = '*@';
        // ===CALENDAR DOM=== //
        this.dayInMonthDOM = 'dayInMonth';
        this.spanDOM = 'span';
        this.personalDOM = 'personal';
        this.idDOM = 'id';
    }
}

module.exports = new SeparatorService();