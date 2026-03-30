# Instructions

## Setup Instructions

1. Open the project in your IDE (VSCode recommended)
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Open `src/settings/settings.js`
2. Configure the settings according to your needs:
   - `YEAR`: Year to create calendar for (e.g., 2025)
   - `SOURCE_PATH`: Path to previous year's source events file
   - `CALENDAR_IL_LINK`: Israeli calendar website URL
   - `CALENDAR_US_LINK`: US holidays website URL
   - `DIST_FILE_NAME`: Name for the output file (default: 'event-dates')
   - `OUTER_APPLICATION_PATH`: Path to parent directory containing backups, sources, etc.

## Running Scripts

### Create New Calendar
Generates a new calendar file for the target year:
```bash
npm start
```

**Prerequisites:**
- Previous year's source file must exist (e.g., `sources/event-dates-2024.txt` for creating 2025)
- Internet connection required to fetch calendar data from online sources
- Proper paths configured in settings

**What it does:**
- Fetches Israeli calendar events and holidays
- Fetches US holidays and events
- Processes birthdays, death anniversaries, and expiration dates
- Creates recurring tasks (daily, weekly, weekend patterns)
- Combines all events into a single organized calendar file
- Saves output to `dist/event-dates-YYYY.txt`

### Scan for Unmarked Tasks
Validates and identifies unmarked tasks in calendar files:
```bash
npm run scan
```

**What it does:**
- Scans calendar files for tasks without proper markers
- Identifies formatting issues
- Reports statistics

### Backup Project
Creates a timestamped backup of the entire project:
```bash
npm run backup
```

**Configuration:**
- Automatically excludes directories: `.git`, `dist`, `node_modules`, `sources`
- Includes hidden files like `.gitignore`
- Creates versioned backups in the configured backups directory

## File Structure

### Source Files
- `sources/event-dates-YYYY.txt` - Previous year's calendar (used as source for new year)
- Contains birthdays, anniversaries, expiration dates, and custom events

### Output Files (`dist/`)
Generated calendar files are placed in the dist directory:
- `event-dates-YYYY.txt` - New calendar file for the target year

### Backup Files
Located in the configured backups directory outside the project:
- Timestamped project snapshots
- Versioned backups if same timestamp exists

## Calendar Format

The application generates a text-based calendar with:
- **Daily entries**: One entry per day of the year
- **Event types**:
  - Birthdays (with age calculation)
  - Death anniversaries (years since)
  - Expiration dates (e.g., subscriptions, documents)
  - Israeli holidays and events
  - US holidays (translated to Hebrew)
  - Recurring tasks (daily, weekly, monthly patterns)
  - Weekend tasks (every weekend or every second weekend)
- **Formatting**: Text-based with clear separators and markers

## Settings Breakdown

### General Settings
- `YEAR`: Target year for calendar generation
- `CALENDAR_IL_LINK`: Israeli calendar data source URL
- `CALENDAR_US_LINK`: US holidays data source URL

### Count & Limit Settings
- `MILLISECONDS_END_DELAY_COUNT`: Delay before exit (default: 1000ms)
- `MAXIMUM_URL_VALIDATION_COUNT`: URL validation retry attempts (default: 5)
- `MILLISECONDS_TIMEOUT_URL_VALIDATION`: Timeout between retries (default: 1000ms)

### Path Settings
- `SOURCE_PATH`: Previous year's calendar file location
- `OUTER_APPLICATION_PATH`: Parent directory path
- `INNER_APPLICATION_PATH`: Project root directory
- Dynamic paths (calculated at runtime): `APPLICATION_PATH`, `BACKUPS_PATH`, `DIST_PATH`, etc.

### Backup Settings
- `IGNORE_DIRECTORIES`: Directories excluded from backup
- `IGNORE_FILES`: Specific files excluded from backup
- `INCLUDE_FILES`: Force-included files (e.g., `.gitignore`)
- `BACKUP_MAXIMUM_DIRECTORY_VERSIONS_COUNT`: Max backup versions (default: 50)

## Development

### Project Structure
```
event-dates-calendar/
├── src/
│   ├── core/           # Models, enums, and core structures
│   ├── culture/        # Text constants and translations
│   ├── logics/         # Main business logic
│   ├── scripts/        # Entry point scripts
│   ├── services/       # Service layer
│   ├── settings/       # Configuration
│   ├── tests/          # Test files
│   └── utils/          # Utility functions
├── sources/            # Source calendar files
├── dist/               # Output files
└── package.json
```

### Running Tests
```bash
npm run sand
```

## Successful Execution Example

When the application runs successfully, you should see:
```
===IMPORTANT SETTINGS===
YEAR: 2025
DIST_FILE_NAME: event-dates
========================
OK to run? (y = yes)
y
===VALIDATE GENERAL SETTINGS===
===INITIATE THE SERVICES===
===CREATE TEXT FILE===
===EXIT: FINISH===
```

## Troubleshooting

### Common Issues

1. **Internet Connection Required**
   - The application needs internet access to fetch calendar data
   - Validate connection using the configured `VALIDATION_CONNECTION_LINK`

2. **Source File Not Found**
   - Ensure previous year's calendar file exists at `SOURCE_PATH`
   - Check file naming convention: `event-dates-YYYY.txt`

3. **Path Configuration**
   - Verify `OUTER_APPLICATION_PATH` points to correct parent directory
   - Ensure backups and sources directories exist

4. **URL Validation Failures**
   - Check calendar URLs are still valid
   - Increase `MAXIMUM_URL_VALIDATION_COUNT` if needed
   - Verify internet connection stability

## Notes

- All calendar files use UTF-8 encoding
- Hebrew text is supported and properly formatted
- The application creates organized daily entries for the entire year
- Event dates are automatically calculated and formatted
- Proper file permissions required for reading sources and writing to dist

## Author

* **Or Assayag** - *Initial work* - [orassayag](https://github.com/orassayag)
* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag
