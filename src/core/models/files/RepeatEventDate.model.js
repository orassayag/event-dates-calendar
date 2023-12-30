class RepeatEventDateModel {
  constructor(data) {
    const { id, day, dayInWeek, displayText, eventYear } = data;
    this.id = id;
    this.day = day;
    this.dayInWeek = dayInWeek;
    this.displayText = displayText;
    this.eventYear = eventYear;
  }
}

export default RepeatEventDateModel;
