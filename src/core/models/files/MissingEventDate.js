class MissingEventDate {

    constructor (data) {
        const { id, includeText, excludeText, displayText, isDayBefore } = data;
        this.id = id;
        this.includeText = includeText;
        this.excludeText = excludeText;
        this.displayText = displayText;
        this.isDayBefore = isDayBefore;
    }
}

module.exports = MissingEventDate;
/*         this.isSameDay = isSameDay; */
/* , isSameDay */