import path from 'path';
import { fileURLToPath } from 'url';
import { pathUtils } from '../utils';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const settings = {
    // ===GENERAL=== //
    // Determine the year to create the event dates calendar for.
    YEAR: 2023,
    // Determine the URL of which to take the calendar Hebrew events and holidays.
    CALENDAR_IL_LINK: 'https://calendar.2net.co.il/annual-calendar.aspx?year=',
    // Determine the URL of which to take the calendar United States events and holidays.
    CALENDAR_US_LINK: 'https://www.timeanddate.com/holidays/us/',

    // ===LOG=== //
    // Determine the name of the resulting `event dates` new TXT file in the 'dist' directory.
    DIST_FILE_NAME: 'event-dates',

    // ===COUNT & LIMIT=== //
    // Determine the delay in milliseconds to pause before exiting the application in the end.
    MILLISECONDS_END_DELAY_COUNT: 1000,
    // Determine the number of retries to validate the URLs.
    MAXIMUM_URL_VALIDATION_COUNT: 5,
    // Determine the milliseconds count timeout to wait between URL validation retry.
    MILLISECONDS_TIMEOUT_URL_VALIDATION: 1000,

    // ===SOURCE=== //
    // Determine the path of the event dates source. This file contain all the birthdays, deathdays, expiration services
    // dates, and other data to be included in the new TXT file.
    SOURCE_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../sources/event-dates-2022.txt'
    }),

    // ===ROOT PATH=== //
    // Determine the application name used for some of the calculated paths.
    APPLICATION_NAME: 'event-dates-calendar',
    // Determine the path for the outer application, where other directories located, such as backups, sources, etc...
    // (Working example: 'C:\\Or\\Web\\event-dates-calendar\\').
    OUTER_APPLICATION_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../../'
    }),
    // Determine the inner application path where all the source of the application is located.
    // (Working example: 'C:\\Or\\Web\\event-dates-calendar\\event-dates-calendar\\').
    INNER_APPLICATION_PATH: pathUtils.getJoinPath({
        targetPath: __dirname,
        targetName: '../../'
    }),

    // ===DYNAMIC PATH=== //
    // All these paths will be calculated during runtime in the initial service.
    // DON'T REMOVE THE KEYS, THEY WILL BE CALCULATED TO PATHS DURING RUNTIME.
    // Determine the application path where all the source of the application is located.
    // (Working example: 'C:\\Or\\Web\\event-dates-calendar\\event-dates-calendar').
    APPLICATION_PATH: 'event-dates-calendar',
    // Determine the backups directory which all the local backup will be created to.
    // (Working example: 'C:\\Or\\Web\\event-dates-calendar\\backups').
    BACKUPS_PATH: 'backups',
    // Determine the dist directory path which there, all the outcome of the logs will be created.
    // (Working example: 'C:\\Or\\Web\\event-dates-calendar\\event-dates-calendar\\dist').
    DIST_PATH: 'dist',
    // (Working example: 'C:\\Or\\Web\\event-dates-calendar\\event-dates-calendar\\node_modules').
    NODE_MODULES_PATH: 'node_modules',
    // (Working example: 'C:\\Or\\Web\\event-dates-calendar\\event-dates-calendar\\package.json').
    PACKAGE_JSON_PATH: 'package.json',
    // (Working example: 'C:\\Or\\Web\\event-dates-calendar\\event-dates-calendar\\package-lock.json').
    PACKAGE_LOCK_JSON_PATH: 'package-lock.json',

    // ===BACKUP=== //
    // Determine the directories to ignore when a backup copy is taking place.
    // For example: 'dist'.
    IGNORE_DIRECTORIES: ['.git', 'dist', 'node_modules', 'sources'],
    // Determine the files to ignore when the back copy is taking place.
    // For example: 'back_sources_tasks.txt'.
    IGNORE_FILES: [],
    // Determine the files to force include when the back copy is taking place.
    // For example: '.gitignore'.
    INCLUDE_FILES: ['.gitignore'],
    // Determine the period of time in milliseconds to
    // check that files were created / moved to the target path.
    MILLISECONDS_DELAY_VERIFY_BACKUP_COUNT: 1000,
    // Determine the number of times in loop to check for version of a backup.
    // For example, if a backup name 'test-test-test-1' exists, it will check for 'test-test-test-2',
    // and so on, until the current maximum number.
    BACKUP_MAXIMUM_DIRECTORY_VERSIONS_COUNT: 50,

    // ===VALIDATION=== //
    // Determine the link address to test the internet connection.
    VALIDATION_CONNECTION_LINK: 'google.com'
};

export default settings;