import { ApplicationDataModel } from '../../core/models/index.js';

class ApplicationService {
  constructor() {
    this.applicationDataModel = null;
  }

  initiate(settings, status) {
    this.applicationDataModel = new ApplicationDataModel({
      settings: settings,
      status: status,
    });
  }
}

export default new ApplicationService();
