const errorScript = require('./error.script');
require('../services/files/initiate.service').initiate('create');
const CreateLogic = require('../logics/create.logic');

(async () => {
    await new CreateLogic().run();
})().catch(e => errorScript.handleScriptError(e, 1));