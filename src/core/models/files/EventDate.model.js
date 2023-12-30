class EventDateModel {
  constructor(data) {
    const {
      id,
      day,
      month,
      year,
      eventType,
      text,
      eventYear,
      isVacation = false,
    } = data;
    this.id = id;
    this.day = day;
    this.month = month;
    this.year = year;
    this.eventType = eventType;
    this.text = text;
    this.eventYear = eventYear;
    this.isVacation = isVacation;
  }
}

export default EventDateModel;
