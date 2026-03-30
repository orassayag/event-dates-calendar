# Contributing

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

Everyone is welcome to contribute to this project. Contributing doesn't just mean submitting pull requests—there are many different ways for you to get involved, including answering questions, reporting issues, improving documentation, or suggesting new features.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:
1. Check if the issue already exists in the [GitHub Issues](https://github.com/orassayag/event-dates-calendar/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Error messages (if applicable)
   - Your environment details (OS, Node version)

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the code style guidelines below
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

### Code Style Guidelines

This project uses:
- **JavaScript ES6+** with modern module syntax
- **ESLint** for code quality

Before submitting:
```bash
# Check for linting errors
npm run lint

# Test the scripts
npm start
npm run scan
npm run backup
```

### Coding Standards

1. **Clean Code**: Write simple, readable, and modular code
2. **Naming**: Use clear, descriptive names for variables and functions
3. **Comments**: Add helpful explanatory comments to clarify complex logic
4. **Error Handling**: Provide meaningful error messages
5. **Testing**: Test your changes with real data

### Adding New Features

When adding new features:
1. Update the settings in `src/settings/settings.js` if configuration is needed
2. Add service logic in `src/services/` for reusable functionality
3. Add utility functions in `src/utils/` if needed
4. Update models in `src/core/models/` for data structures
5. Test thoroughly with various scenarios
6. Update documentation (README.md, INSTRUCTIONS.md)

### Code Organization

- **Scripts** (`src/scripts/`): Entry points for different operations
- **Logics** (`src/logics/`): Main business logic orchestration
- **Services** (`src/services/`): Reusable service layers
- **Utils** (`src/utils/`): Utility functions
- **Models** (`src/core/models/`): Data models and structures
- **Culture** (`src/culture/`): Text constants and translations

## Questions or Need Help?

Please feel free to contact me with any question, comment, pull-request, issue, or any other thing you have in mind.

* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag

Thank you for contributing! 🙏
