const fs = require('fs-extra');
const globalUtils = require('./global.utils');

/*
const pathUtils = require('./path.utils');
const textUtils = require('./text.utils'); */

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
            throw new Error(`targetPath not received: ${targetPath} (1000015)`);
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

    isDirectoryPath(targetPath) {
        const stats = fs.statSync(targetPath);
        return stats.isDirectory();
    }

/*     async read(targetPath) {
        return await fs.readFile(targetPath, 'utf-8');
    }

    getAllDirectories(targetPath) {
        return fs.readdirSync(targetPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    }

    async getFilesRecursive(data) {
        const { directory, includeDirectories, ignoreFiles, ignorePaths } = data;
        if (ignorePaths.some(d => textUtils.toLowerCase(directory).includes(d))) {
            return [];
        }
        const dirents = await fs.readdir(directory, { withFileTypes: true });
        let files = [];
        if (includeDirectories) {
            files.push(directory);
        }
        files = [...files, ...await Promise.all(dirents.map(dirent => {
            const result = pathUtils.resolve(directory, dirent.name);
            if (dirent.isDirectory()) {
                return this.getFilesRecursive({
                    directory: result,
                    includeDirectories: includeDirectories,
                    ignorePaths: ignorePaths,
                    ignoreFiles: ignoreFiles
                });
            }
            else {
                for (let i = 0; i < ignoreFiles.length; i++) {
                    const fileFullName = pathUtils.getFullFileName(result);
                    if (fileFullName && fileFullName === ignoreFiles[i]) {
                        return [];
                    }
                }
                return result;
            }
        }))];
        return Array.prototype.concat(...files);
    }

    isFilePath(targetPath) {
        const stats = fs.statSync(targetPath);
        return stats.isFile();
    }

    getItemName(targetPath) {
        const stats = fs.statSync(targetPath);
        let itemName, itemFullName, itemDirectoryPath = null;
        if (stats.isDirectory()) {
            itemName = pathUtils.getDirectoryName(targetPath);
            itemFullName = itemName;
            itemDirectoryPath = targetPath;
        }
        else {
            itemName = pathUtils.getFileName(targetPath);
            itemFullName = pathUtils.getBasename(targetPath);
            itemDirectoryPath = pathUtils.getDirectoryPath(targetPath);
        }
        return {
            itemName: itemName,
            itemFullName: itemFullName,
            itemDirectoryPath: itemDirectoryPath
        };
    }

    async appendFile(data) {
        const { targetPath, message } = data;
        if (!targetPath) {
            throw new Error(`targetPath not found: ${targetPath} (1000016)`);
        }
        if (!message) {
            throw new Error(`message not found: ${message} (1000017)`);
        }
        if (!await this.isPathExists(targetPath)) {
            await fs.promises.mkdir(pathUtils.getDirectoryPath(targetPath), { recursive: true }).catch(console.error);
        }
        // Append the message to the file.
        await fs.appendFile(targetPath, message);
    }

    getFileType(targetPath) {
        if (!targetPath) {
            throw new Error(`targetPath not found: ${targetPath} (1000018)`);
        }
        return pathUtils.getExtname(targetPath);
    }

    createStream(targetPath) {
        if (!targetPath) {
            throw new Error(`targetPath not found: ${targetPath} (1000019)`);
        }
        return fs.createReadStream(targetPath, { encoding: 'utf8' });
    }

    createWriteStream(targetPath) {
        return fs.createWriteStream(targetPath, { encoding: 'utf8' });
    } */
}

module.exports = new FileUtils();