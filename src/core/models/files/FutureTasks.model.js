class FutureTasksModel {
  constructor(data) {
    const { id, day, month, year } = data;
    this.id = id;
    this.day = day;
    this.month = month;
    this.year = year;
    this.eventsLines = [];
  }

  addEvent(eventLine) {
    this.eventsLines.push(eventLine);
  }
}

export default FutureTasksModel;
