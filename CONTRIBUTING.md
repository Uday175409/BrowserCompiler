# Contributing to CodeCompiler

We love your input! We want to make contributing to CodeCompiler as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/uday-0408/compiler/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/uday-0408/compiler/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/compiler.git
   cd compiler
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database Setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Run Tests**
   ```bash
   python manage.py test
   ```

## Code Style

- Use Python PEP 8 style guide
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Keep line length under 88 characters
- Use type hints where appropriate

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that do not affect the meaning of the code
- `refactor:` - A code change that neither fixes a bug nor adds a feature
- `test:` - Adding missing tests or correcting existing tests
- `chore:` - Changes to the build process or auxiliary tools

Example:
```
feat: add support for Rust language
fix: resolve memory leak in code execution
docs: update installation instructions
```

## Testing

- Write tests for any new functionality
- Ensure all existing tests pass
- Test your changes locally before submitting
- Include both unit tests and integration tests where appropriate

## Documentation

- Update README.md if you change functionality
- Add docstrings to new functions and classes
- Update API documentation for any endpoint changes
- Include code comments for complex logic

## Code Review Process

1. All code changes happen through pull requests
2. Maintainers will review your code
3. Address any feedback or requested changes
4. Once approved, your code will be merged

## Getting Help

- Check existing [issues](https://github.com/uday-0408/compiler/issues)
- Start a [discussion](https://github.com/uday-0408/compiler/discussions)
- Contact maintainers directly for sensitive issues

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- Project documentation

Thank you for contributing to CodeCompiler! 🚀
