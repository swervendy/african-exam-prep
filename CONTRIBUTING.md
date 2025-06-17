# Contributing to African Exam Prep

Thank you for your interest in contributing to African Exam Prep! This document provides guidelines and information for contributors.

## 🎯 How Can I Contribute?

### 🐛 Reporting Bugs
- Use the GitHub issue template
- Provide detailed steps to reproduce
- Include browser/device information
- Add screenshots if applicable

### 💡 Suggesting Enhancements
- Check existing issues first
- Use the feature request template
- Explain the use case and benefits
- Consider implementation complexity

### 🔧 Code Contributions
- Fork the repository
- Create a feature branch
- Follow coding standards
- Add tests for new features
- Update documentation

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development
1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see README)
4. Start development server: `npm run dev`
5. Run tests: `npm test`

## 📝 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible
- Use strict mode

### React Components
- Use functional components with hooks
- Keep components under 200 lines
- Use proper prop types/interfaces
- Follow naming conventions

### File Structure
```
src/
├── components/     # Reusable components
├── pages/         # Next.js pages and API routes
├── lib/           # Utility functions
├── utils/         # Additional utilities
└── types/         # TypeScript type definitions
```

### Naming Conventions
- **Files**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase with 'Props' suffix for component props

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

## 🧪 Testing

### Writing Tests
- Test all new features
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

### Test Structure
```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Explain business logic
- Update README for new features

### API Documentation
- Document all new endpoints
- Include request/response examples
- Specify error codes
- Update API docs in README

## 🔄 Pull Request Process

### Before Submitting
1. Ensure all tests pass
2. Update documentation
3. Follow commit message conventions
4. Rebase on main branch

### Commit Messages
Use conventional commits format:
```
type(scope): description

feat(quiz): add timer functionality
fix(api): resolve session storage issue
docs(readme): update installation instructions
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### PR Template
- Describe the changes
- Link related issues
- Include screenshots for UI changes
- List any breaking changes
- Confirm testing completed

## 🚀 Deployment

### Environment Variables
- Never commit sensitive data
- Use `.env.local` for local development
- Document required environment variables
- Use Vercel for production deployment

### Build Process
1. Run tests: `npm test`
2. Build application: `npm run build`
3. Check for TypeScript errors
4. Verify production build

## 🤝 Community Guidelines

### Communication
- Be respectful and inclusive
- Use clear, constructive language
- Ask questions when unsure
- Help other contributors

### Code Review
- Review others' code constructively
- Suggest improvements politely
- Focus on the code, not the person
- Be open to feedback

## 📋 Issue Templates

### Bug Report
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g., Chrome 91]
- OS: [e.g., macOS 12.0]
- Version: [e.g., 1.0.0]

## Additional Information
Screenshots, logs, etc.
```

### Feature Request
```markdown
## Feature Description
Brief description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've considered

## Additional Information
Mockups, examples, etc.
```

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Community acknowledgments

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/africanexamprep/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/africanexamprep/discussions)
- **Email**: contributors@africanexamprep.com

Thank you for contributing to African Exam Prep! 🎉 