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
        // ===CALENDAR IL DOM=== //
        this.dayInMonthDOM = 'dayInMonth';
        this.spanDOM = 'span';
        this.personalDOM = 'personal';
        this.idDOM = 'id';
        // ===CALENDAR US DOM=== //
        this.rowDOM = 'tr';
        this.cellDOM = 'td';
        this.unixDataDOM = 'data-date';
    }
}

export default new SeparatorService();