# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React practice project. Update this section with the project's purpose and main features as development progresses.

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
npm run dev          # Start development server
```

### Build
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Testing
```bash
npm test             # Run all tests
npm test -- <file>   # Run specific test file
```

### Linting
```bash
npm run lint         # Run linter
```

## Architecture

### Project Structure
- Update this section as the project structure develops
- Include information about key directories and their purposes
- Document any architectural patterns or conventions used

### Key Concepts
- Document important architectural decisions
- Explain custom patterns or conventions specific to this codebase
- Note any non-obvious dependencies between modules

## Testing Guidelines

### Test Implementation Principles
- Tests must verify actual functionality, never use meaningless assertions like `expect(true).toBe(true)`
- Follow Red-Green-Refactor: start with failing tests
- Test boundary values, edge cases, and error scenarios
- Keep mocks minimal - test close to real behavior
- Test names must clearly describe what is being tested

### Strictly Forbidden
- **NO hardcoding** values in production code just to make tests pass
- **NO test mode conditionals** (e.g., `if(testMode)`) in production code
- **NO magic numbers** or special test values embedded in production code
- Use environment variables or configuration files to properly separate test and production environments

### Before Writing Tests
- Fully understand the feature specification
- Ask for clarification rather than making assumptions
- Focus on quality over coverage metrics

## Notes
- Update this file as the project evolves
- Remove or update sections that become irrelevant
- Add project-specific conventions and patterns as they emerge
