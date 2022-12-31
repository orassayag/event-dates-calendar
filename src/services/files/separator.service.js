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
        this.completeCancelTasksSeparator = '#COPY-START#';
        this.dayTasksSeparator = '#DAY#';
        this.weekendTasksSeparator = '#WEEKEND#';
        this.weekendToggleTasksSeparator = '#WEEKEND-ALT#';
        this.endMonthTasksSeparator = '#END-MONTH#';
        this.halfYearTasksSeparator = '#HALF-YEAR#';
        this.yearTasksSeparator = '#YEAR#';
        this.endYearTasksSeparator = '#END-YEAR#';
        this.futureTasksSeparator = '#FUTURE#';
        this.startEventsSeparator = '#EVENTS#';
        // ===CALENDAR IL DOM=== //
        this.todayDOM = 'today';
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