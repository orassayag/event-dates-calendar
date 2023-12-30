import errorScript from './error.script.js';
import initiateService from '../services/files/initiate.service.js';
import CreateLogic from '../logics/create.logic.js';
initiateService.initiate('create');

(async () => {
  await new CreateLogic().run();
})().catch((e) => errorScript.handleScriptError(e, 1));
