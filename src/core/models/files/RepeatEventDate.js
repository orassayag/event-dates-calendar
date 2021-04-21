class RepeatEventDate {

    constructor(data) {
        const { id, day, dayInWeek, displayText } = data;
        this.id = id;
        this.day = day;
        this.dayInWeek = dayInWeek;
        this.displayText = displayText;
    }
}

module.exports = RepeatEventDate;