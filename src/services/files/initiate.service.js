const settings = require('../../settings/settings');
const { ScriptTypeEnum } = require('../../core/enums');
const globalUtils = require('../../utils/files/global.utils');
const { fileUtils, pathUtils, validationUtils } = require('../../utils');

class InitiateService {

	constructor() {
		this.scriptType = null;
	}

	initiate(scriptType) {
		// First, setup handles errors and promises.
		this.setup();
		// Validate the script type.
		this.scriptType = scriptType;
		this.validateScriptType();
		// The second important thing to do is to validate all the parameters of the settings.js file.
		this.validateSettings();
		// The next thing is to calculate paths and inject back to the settings.js file.
		this.calculateSettings();
		// Make sure that the dist directory exists. If not, create it.
		this.validateDirectories();
		// Validate that certain directories exist, and if not, create them.
		this.createDirectories();
	}

	setup() {
		// Handle any uncaughtException error.
		process.on('uncaughtException', (error) => {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			console.log(error);
			process.exit(0);
		});
		// Handle any unhandledRejection promise error.
		process.on('unhandledRejection', (reason, promise) => {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			console.log(reason);
			console.log(promise);
			process.exit(0);
		});
	}

	validateScriptType() {
		if (!this.scriptType || !validationUtils.isValidEnum({
			enum: ScriptTypeEnum,
			value: this.scriptType
		})) {
			throw new Error('Invalid or no ScriptType parameter was found (1000006)');
		}
	}

	validateSettings() {
		// Validate the settings object existence.
		if (!settings) {
			throw new Error('Invalid or no settings object was found (1000007)');
		}
		this.validatePositiveNumbers();
		this.validateStrings();
		this.validateBooleans();
		this.validateArrays();
		this.validateSpecial();
	}

	calculateSettings() {
		const { OUTER_APPLICATION_PATH, INNER_APPLICATION_PATH, APPLICATION_PATH, BACKUPS_PATH, DIST_PATH,
			NODE_MODULES_PATH, PACKAGE_JSON_PATH, PACKAGE_LOCK_JSON_PATH } = settings;
		// ===DYNAMIC PATH=== //
		settings.APPLICATION_PATH = pathUtils.getJoinPath({ targetPath: OUTER_APPLICATION_PATH, targetName: APPLICATION_PATH });
		if (this.scriptType === ScriptTypeEnum.BACKUP) {
			settings.BACKUPS_PATH = pathUtils.getJoinPath({ targetPath: OUTER_APPLICATION_PATH, targetName: BACKUPS_PATH });
		}
		settings.DIST_PATH = pathUtils.getJoinPath({ targetPath: INNER_APPLICATION_PATH, targetName: DIST_PATH });
		settings.NODE_MODULES_PATH = pathUtils.getJoinPath({ targetPath: INNER_APPLICATION_PATH, targetName: NODE_MODULES_PATH });
		settings.PACKAGE_JSON_PATH = pathUtils.getJoinPath({ targetPath: INNER_APPLICATION_PATH, targetName: PACKAGE_JSON_PATH });
		settings.PACKAGE_LOCK_JSON_PATH = pathUtils.getJoinPath({ targetPath: INNER_APPLICATION_PATH, targetName: PACKAGE_LOCK_JSON_PATH });
	}

	validatePositiveNumbers() {
		[
			// ===GENERAL=== //
			'YEAR',
			// ===COUNT & LIMIT=== //
			'MILLISECONDS_END_DELAY_COUNT', 'MAXIMUM_URL_VALIDATION_COUNT', 'MILLISECONDS_TIMEOUT_URL_VALIDATION',
			// ===BACKUP=== //
			'MILLISECONDS_DELAY_VERIFY_BACKUP_COUNT', 'BACKUP_MAXIMUM_DIRECTORY_VERSIONS_COUNT'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isPositiveNumber(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Expected a number but received: ${value} (10000008)`);
			}
		});
	}

	validateStrings() {
		const keys = this.scriptType === ScriptTypeEnum.BACKUP ? ['BACKUPS_PATH'] : [];
		[
			...keys,
			// ===GENERAL=== //
			'CALENDAR_IL_LINK', 'CALENDAR_US_LINK',
			// ===LOG=== //
			'DIST_FILE_NAME',
			// ===SOURCE=== //
			'SOURCE_PATH',
			// ===ROOT PATH=== //
			'APPLICATION_NAME', 'OUTER_APPLICATION_PATH', 'INNER_APPLICATION_PATH',
			// ===DYNAMIC PATH=== //
			'APPLICATION_PATH', 'DIST_PATH', 'NODE_MODULES_PATH', 'PACKAGE_JSON_PATH',
			'PACKAGE_LOCK_JSON_PATH',
			// ===VALIDATION=== //
			'VALIDATION_CONNECTION_LINK'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isExists(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Expected a string but received: ${value} (1000009)`);
			}
		});
	}

	validateBooleans() {
		[
			// ===LOG=== //
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isValidBoolean(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Expected a boolean but received: ${value} (1000010)`);
			}
		});
	}

	validateArrays() {
		[
			// ===BACKUP=== //
			'IGNORE_DIRECTORIES', 'IGNORE_FILES', 'INCLUDE_FILES'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isValidArray(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Expected a array but received: ${value} (1000011)`);
			}
		});
	}

	validateSpecial() {
		const { YEAR } = settings;
		// ===GENERAL=== //
		if (YEAR < 1900 || YEAR > 2100) {
			throw new Error('Invalid YEAR parameter was found (1000012)');
		}
		[
			// === GENERAL === //
			'CALENDAR_IL_LINK', 'CALENDAR_US_LINK',
			// ===VALIDATION=== //
			'VALIDATION_CONNECTION_LINK'
		].map(key => {
			const value = settings[key];
			if (!validationUtils.isValidLink(value)) {
				throw new Error(`Invalid or no ${key} parameter was found: Expected a valid URL but received: ${value} (1000013)`);
			}
		});
	}

	validateDirectories() {
		const keys = this.scriptType === ScriptTypeEnum.BACKUP ? ['BACKUPS_PATH'] : [];
		[
			...keys,
			// ===ROOT PATH=== //
			'OUTER_APPLICATION_PATH', 'INNER_APPLICATION_PATH',
			// ===DYNAMIC PATH=== //
			'APPLICATION_PATH', 'PACKAGE_JSON_PATH'
		].map(key => {
			const value = settings[key];
			// Verify that the dist and the sources paths exist.
			globalUtils.isPathExistsError(value);
			// Verify that the dist and the sources paths are accessible.
			globalUtils.isPathAccessible(value);
		});
		[
			...keys,
			// ===ROOT PATH=== //
			'OUTER_APPLICATION_PATH', 'INNER_APPLICATION_PATH'
		].map(key => {
			const value = settings[key];
			// Verify that the paths are of directory and not a file.
			if (!fileUtils.isDirectoryPath(value)) {
				throw new Error(`The parameter path ${key} marked as directory but it's a path of a file: ${value} (1000014)`);
			}
		});
	}

	createDirectories() {
		[
			// ===DYNAMIC PATH=== //
			'DIST_PATH', 'NODE_MODULES_PATH'
		].map(key => {
			const value = settings[key];
			// Make sure that the dist directory exists, if not, create it.
			fileUtils.createDirectory(value);
		});
	}
}

module.exports = new InitiateService();