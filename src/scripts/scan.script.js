import errorScript from './error.script';
import initiateService from '../services/files/initiate.service';
import ScanLogic from '../logics/scan.logic';
initiateService.initiate('scan');

(async () => {
    await new ScanLogic().run();
})().catch(e => errorScript.handleScriptError(e, 1));