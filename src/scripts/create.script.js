import errorScript from './error.script';
import initiateService from '../services/files/initiate.service';
import CreateLogic from '../logics/create.logic';
initiateService.initiate('create');

(async () => {
    await new CreateLogic().run();
})().catch(e => errorScript.handleScriptError(e, 1));