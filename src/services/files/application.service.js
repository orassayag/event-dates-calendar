const { ApplicationDataModel } = require('../../core/models');

class ApplicationService {

    constructor() {
        this.applicationDataModel = null;
    }

    initiate(settings, status) {
        this.applicationDataModel = new ApplicationDataModel({
            settings: settings,
            status: status
        });
    }
}

module.exports = new ApplicationService();