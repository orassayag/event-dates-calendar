class PathData {

	constructor(settings) {
		// Set the parameters from the settings file.
		const { SOURCE_PATH, DIST_PATH } = settings;
		this.distPath = DIST_PATH;
		this.sourcePath = SOURCE_PATH;
	}
}

module.exports = PathData;