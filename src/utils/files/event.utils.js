class EventUtils {

    constructor() { }

    createEventTemplate(text) {
        if (!text) {
            return text;
        }
        return `-${text.trim()}.`;
    }

    toggleOfTaskTemplate(text) {
        if (!text) {
            return text;
        }
        return text.trim();
    }

    completeEventTemplate(text1, text2) {
        if (!text1 || !text2) {
            return '';
        }
        return this.createEventTemplate(`${text1} ${text2.substring(1).slice(0, -1)}`);
    }

    getDayEventTemplate(text1, text2) {
        if (!text1 || !text2) {
            return '';
        }
        return this.createEventTemplate(`${text1}${text2.substring(1)}`);
    }

    warpBreakLine(text) {
        return `${text}\n`;
    }

    warpBreakRLines(text) {
        return `${text}\r`;
    }

    warpBreakLines(list) {
        return list.join('\n');
    }

    warpEmpty(list) {
        return list.join('');
    }
}

export default new EventUtils();