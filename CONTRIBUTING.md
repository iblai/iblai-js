# Contributing to ibl.ai SDK

Thank you for contributing to the ibl.ai SDK!

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0

### Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Build the package: `pnpm build`
4. Start Storybook: `pnpm storybook`

## Project Structure

```
packages/iblai-js/src/
├── data-layer/       # RTK Query API slices and hooks
├── web-utils/        # Providers, hooks, and utilities
├── web-containers/   # React UI components for web
└── native-components/ # React Native components
```

## Development Workflow

### Adding New Features

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Add your code in the appropriate module directory
3. Document your code with JSDoc comments
4. Create Storybook stories for UI components (`.stories.tsx`)
5. Write tests
6. Run checks: `pnpm typecheck && pnpm format`
7. Create a changeset: `pnpm changeset`
8. Commit and push your changes

### Code Standards

- **TypeScript**: Use strict typing, avoid `any`
- **Files**: Use kebab-case (`my-component.tsx`)
- **Components**: Use PascalCase (`MyComponent`)
- **Functions**: Use camelCase (`getUserData`)
- **Documentation**: Add JSDoc comments for all exports

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
chore: update dependencies
```

### Documenting Components

All UI components must have:

1. **JSDoc comments** with description and examples
2. **Storybook stories** showing usage
3. **TypeScript types** for props

Example:

```tsx
/**
 * Button component for user interactions
 *
 * @example
 * ```tsx
 * <Button onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 */
export const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
```

## Submitting Changes

1. Push your branch to your fork
2. Open a Pull Request
3. Ensure CI passes
4. Respond to review feedback

## Questions?

Open an issue or discussion on GitHub.
