class EventDateModel {

    constructor(data) {
        const { id, day, month, year, eventType, text } = data;
        this.id = id;
        this.day = day;
        this.month = month;
        this.year = year;
        this.eventType = eventType;
        this.text = text;
    }
}

export default EventDateModel;