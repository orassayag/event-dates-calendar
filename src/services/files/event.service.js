const pathService = require('./path.service');
const { fileUtils, pathUtils } = require('../../utils');

class EventService {

    constructor() { }

    async getSourceEvents() {
        // Validate the source event dates TXT file and get the stream.
        await this.validateSourceFile({
            filePath: pathService.pathData.sourcePath,
            parameterName: 'SOURCE_PATH'
        });
        // Scan the source event dates TXT file.
        const lineReader = fileUtils.getFileLinesFromStream(pathService.pathData.sourcePath);
        lineReader.on('line', (line) => {
            console.log(line);
        });
    }

    async validateSourceFile(data) {
        const { filePath, parameterName } = data;
        if (!await fileUtils.isPathExists(filePath)) {
            throw new Error(`Invalid or no ${parameterName} parameter was found: Expected a number but received: ${filePath} (1000010)`);
        }
        if (!fileUtils.isFilePath(filePath)) {
            throw new Error(`The parameter path ${parameterName} marked as file but it's a path of a directory: ${filePath} (1000011)`);
        }
        const extension = pathUtils.getExtname(filePath);
        if (extension !== '.txt') {
            throw new Error(`The parameter path ${parameterName} must be a TXT file but it's: ${extension} file (1000012)`);
        }
    }
}

module.exports = new EventService();