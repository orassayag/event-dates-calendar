class SourceEventResult {

    constructor() {
        this.sourceEventDates = [];
        this.dataLines = [];
        this.commonTasks = [];
        this.dailyTasks = [];
        this.weekendTasks = [];
        this.weekendOnToggleTasks = [];
        this.weekendOffToggleTasks = [];
    }
}

module.exports = SourceEventResult;