class CalendarDayModel {

    constructor(data) {
        const { id, date, displayDate, dayInWeek, displayDayInWeek, eventDatesList } = data;
        this.id = id;
        this.date = date;
        this.displayDate = displayDate;
        this.dayInWeek = dayInWeek;
        this.displayDayInWeek = displayDayInWeek;
        this.eventDatesList = eventDatesList;
    }
}

export default CalendarDayModel;