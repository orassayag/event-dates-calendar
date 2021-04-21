const enumUtils = require('../enum.utils');

const ScriptType = enumUtils.createEnum([
    ['BACKUP', 'backup'],
    ['CREATE', 'create'],
    ['SCAN', 'scan'],
    ['TEST', 'test']
]);

const Status = enumUtils.createEnum([
    ['INITIATE', 'INITIATE'],
    ['VALIDATE', 'VALIDATE'],
    ['CREATE', 'CREATE'],
    ['SCAN', 'SCAN'],
    ['ABORT_BY_THE_USER', 'ABORT BY THE USER'],
    ['FINISH', 'FINISH']
]);

module.exports = { ScriptType, Status };