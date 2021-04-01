class EventUtils {

    constructor() { }

    createEventTemplate(text) {
        if (!text) {
            return text;
        }
        return `-${text.trim()}.`;
    }

    completeEventTemplate(text1, text2) {
        if (!text1 || !text2) {
            return '';
        }
        return this.createEventTemplate(`${text1} ${text2.substring(1).slice(0, -1)}`);
    }

    birthDayEventTemplate(text1, text2) {
        if (!text1 || !text2) {
            return '';
        }
        return this.createEventTemplate(`${text1}${text2.substring(1)}`);
    }
}

module.exports = new EventUtils();