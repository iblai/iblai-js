# ibl.ai SDK

[![npm version](https://ibl.ai/images/iblai-logo.png)](https://www.npmjs.com/package/@iblai/iblai-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript SDK for the [ibl.ai](https://ibl.ai) Platform - providing data layer, utilities, and React components for building AI-powered educational applications.

## Installation

```bash
npm install @iblai/iblai-js
# or
yarn add @iblai/iblai-js
# or
pnpm add @iblai/iblai-js
```

## Basic Usage

```typescript
import { useGetMentorsQuery, AuthProvider } from '@iblai/iblai-js';

function App() {
  return (
    <AuthProvider>
      <MentorsList />
    </AuthProvider>
  );
}

function MentorsList() {
  const { data, isLoading } = useGetMentorsQuery({
    org: 'my-org',
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.results.map((mentor) => (
        <div key={mentor.id}>{mentor.name}</div>
      ))}
    </div>
  );
}
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/iblai/iblai-sdk.git
cd iblai-sdk

# Install dependencies
pnpm install

# Build the package
pnpm build

# Start Storybook for component documentation
pnpm storybook
```

### Project Structure

```
iblai-sdk/
├── packages/
│   └── iblai-js/
│       └── src/
│           ├── data-layer/       # API slices and RTK Query hooks
│           ├── web-utils/        # Providers, hooks, and utilities
│           ├── web-containers/   # React UI components for web
│           └── native-components/ # React Native components
├── .storybook/                   # Storybook configuration
└── README.md
```

### Scripts

- `pnpm build` - Build the package
- `pnpm watch` - Watch mode for development
- `pnpm storybook` - Start Storybook component documentation
- `pnpm build-storybook` - Build static Storybook site
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier

## Documentation

- **[Quick Start Guide](./docs/quickstart/README.md)** - Complete quick start guide for building applications
- **[API Reference](./API.md)** - Complete API documentation
- **[Storybook](http://localhost:6006)** - Interactive component documentation (run `pnpm storybook`)
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## License

MIT © [IBL AI](https://ibl.ai)
