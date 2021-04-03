const errorScript = require('./error.script');
require('../services/files/initiate.service').initiate('scan');
const ScanLogic = require('../logics/scan.logic');

(async () => {
    await new ScanLogic().run();
})().catch(e => errorScript.handleScriptError(e, 1));