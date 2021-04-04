class ValidateSourceEventTypeResult {

    constructor(eventType) {
        this.eventType = eventType;
        this.isBreakLine = false;
        this.isSeparator = false;
    }
}

module.exports = ValidateSourceEventTypeResult;