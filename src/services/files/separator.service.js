class SeparatorService {

    constructor() {
        // ===EVENT=== //
        this.startLineCharacter = '-';
        this.endLineCharacter = '*';
        this.dotLineCharacter = '.';
        this.lineSpace = '\r';
        // ===FILE=== //
        this.eventTypeSeparator = '=';
        this.titleTypeSeparator = ':';
        this.toggleSeparator = '+';
        this.dummySeparator = '^';
        this.completeCancelTasksSeparator = '#@';
        this.dailyTasksSeparator = '!@';
        this.weekendTasksSeparator = '&@';
        this.weekendToggleTasksSeparator = '*@';
        this.monthlyTasksSeparator = '^@';
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