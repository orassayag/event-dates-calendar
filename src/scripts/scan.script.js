import errorScript from './error.script.js';
import initiateService from '../services/files/initiate.service.js';
import ScanLogic from '../logics/scan.logic.js';
initiateService.initiate('scan');

(async () => {
  await new ScanLogic().run();
})().catch((e) => errorScript.handleScriptError(e, 1));
