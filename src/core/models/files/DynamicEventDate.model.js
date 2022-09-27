class DynamicEventDateModel {

    constructor(data) {
        const { id, includeText, displayText, eventYear } = data;
        this.id = id;
        this.includeText = includeText;
        this.displayText = displayText;
        this.eventYear = eventYear;
    }
}

export default DynamicEventDateModel;