class MissingEventDate {

    constructor (data) {
        const { id, includeText, displayText, isDayBefore } = data;
        this.id = id;
        this.includeText = includeText;
        this.displayText = displayText;
        this.isDayBefore = isDayBefore;
    }
}

module.exports = MissingEventDate;
/*         this.isSameDay = isSameDay; */
/* , isSameDay */