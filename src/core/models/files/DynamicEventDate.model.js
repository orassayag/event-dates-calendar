class DynamicEventDateModel {

    constructor(data) {
        const { id, includeText, displayText } = data;
        this.id = id;
        this.includeText = includeText;
        this.displayText = displayText;
    }
}

module.exports = DynamicEventDateModel;