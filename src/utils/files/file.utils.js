const readline = require('readline');
const fs = require('fs-extra');
const pathUtils = require('./path.utils');
const globalUtils = require('./global.utils');

class FileUtils {

    constructor() { }

    // This method removes all files from a given target path.
    async emptyDirectory(targetPath) {
        // Verify that the path exists.
        globalUtils.isPathExistsError(targetPath);
        // Empty the directory.
        await fs.emptyDir(targetPath);
    }

    async copyDirectory(sourcePath, targetPath, filterFunction) {
        await fs.copy(sourcePath, targetPath, { filter: filterFunction });
    }

    async removeDirectoryIfExists(targetPath) {
        if (!await this.isPathExists(targetPath)) {
            await fs.remove(targetPath);
        }
    }

    async createDirectoryIfNotExists(targetPath) {
        if (!await this.isPathExists(targetPath)) {
            await fs.mkdir(targetPath);
        }
    }

    async isPathExists(targetPath) {
        // Check if the path parameter was received.
        if (!targetPath) {
            throw new Error(`targetPath not received: ${targetPath} (1000016)`);
        }
        // Check if the path parameter exists.
        try {
            return await fs.stat(targetPath);
        }
        catch (error) {
            return false;
        }
    }

    createDirectory(targetPath) {
        if (!targetPath) {
            return;
        }
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        }
    }

    isFilePath(targetPath) {
        const stats = fs.statSync(targetPath);
        return stats.isFile();
    }

    isDirectoryPath(targetPath) {
        const stats = fs.statSync(targetPath);
        return stats.isDirectory();
    }

    getFileLinesFromStream(path) {
        const fileStream = fs.createReadStream(path);
        return readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
    }

    async appendFile(data) {
        const { targetPath, message } = data;
        if (!targetPath) {
            throw new Error(`targetPath not found: ${targetPath} (1000017)`);
        }
        if (!message) {
            throw new Error(`message not found: ${message} (1000018)`);
        }
        if (!await this.isPathExists(targetPath)) {
            await fs.promises.mkdir(pathUtils.getDirectoryPath(targetPath), { recursive: true }).catch(console.error);
        }
        // Append the message to the file.
        await fs.appendFile(targetPath, message);
    }
}

module.exports = new FileUtils();