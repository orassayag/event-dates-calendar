const enumUtils = require('../enum.utils');

const ScriptType = enumUtils.createEnum([
    ['BACKUP', 'backup'],
    ['CREATE', 'create'],
    ['TEST', 'test']
]);

const Status = enumUtils.createEnum([
    ['INITIATE', 'INITIATE'],
    ['VALIDATE', 'VALIDATE'],
    ['FINISH', 'FINISH']
]);

module.exports = { ScriptType, Status };