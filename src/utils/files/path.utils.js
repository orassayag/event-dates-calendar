const path = require('path');

class PathUtils {

    constructor() { }

    getJoinPath(data) {
        const { targetPath, targetName } = data;
        // Check if the targetPath parameter was received.
        if (!targetPath) {
            throw new Error(`targetPath not received: ${targetPath} (1000024)`);
        }
        // Check if the fileName parameter was received.
        if (!targetName) {
            throw new Error(`targetName not received: ${targetName} (1000025)`);
        }
        return path.join(targetPath, targetName);
    }

    getBasename(source) {
        return path.basename(source);
    }

    getExtname(filePath) {
        return path.extname(filePath);
    }

/*
    getFileName(filePath) {
        return path.parse(filePath).name;
    }

    getFullFileName(filePath) {
        return path.parse(filePath).base;
    }

    getDirectoryPath(filePath) {
        return path.dirname(filePath);
    }

    getDirectoryName(directoryPath) {
        return directoryPath.split('\\').pop();
    }

    resolve(directory, direntName) {
        return path.resolve(directory, direntName);
    }
 */
}

module.exports = new PathUtils();