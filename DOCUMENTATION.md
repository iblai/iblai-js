# ibl.ai SDK - Storybook Documentation

Complete interactive documentation for the ibl.ai SDK using React Storybook.

## 📚 What's Documented

This Storybook contains comprehensive usage documentation for all exported items from:

- **@iblai/data-layer** - RTK Query hooks and API slices
- **@iblai/web-utils** - Providers, custom hooks, and utilities
- **@iblai/web-containers** - React UI components

## 🚀 Viewing the Documentation

### Start Storybook

```bash
cd iblai-sdk
pnpm storybook
```

This will open Storybook at [http://localhost:6006](http://localhost:6006)

### Build Static Documentation

```bash
pnpm build-storybook
```

Outputs to `storybook-static/` directory.

## 📖 Documentation Structure

### Getting Started
- **Introduction** - Overview and navigation guide
- **Usage Guide** - Complete setup instructions, quick start, best practices
- **Real-World Examples** - Full application examples:
  - Complete Chat Application
  - Analytics Dashboard
  - User Profile Management
  - Subscription Management

### Data Layer
Stories documenting RTK Query hooks:

#### Mentor Hooks (`data-layer/hooks-mentor.stories.tsx`)
- `useGetMentorsQuery` - Fetch list of mentors
- `useGetMentorQuery` - Fetch single mentor
- `useCreateMentorMutation` - Create new mentor
- Cache management and optimization

#### Chat Hooks (`data-layer/hooks-chat.stories.tsx`)
- `useGetChatHistoryQuery` - Fetch chat sessions
- `useSendChatMessageMutation` - Send messages to AI
- File attachments support
- Streaming responses (SSE)
- Session management

### Web Utils
Stories documenting providers and custom hooks:

#### Providers (`web-utils/providers.stories.tsx`)
- **AuthProvider** - Authentication and user sessions
  - Login/logout functionality
  - Token management
  - User state
- **MentorProvider** - Active mentor context
  - Mentor selection
  - Settings access
- **TenantProvider** - Platform configuration
  - Theme settings
  - Feature flags
- **Provider Composition** - Best practices for combining providers

#### Custom Hooks (`web-utils/hooks.stories.tsx`)
- **useChatV2** - Advanced chat interface
  - Message management
  - File uploads
  - Error handling
- **useSubscriptionHandler** - Subscription management
  - Plan selection
  - Billing operations
- **useUserProfileUpdate** - Profile editing
- **useDayJs** - Date/time formatting
- **useMentorSettings** - Mentor configuration

#### Auth Utilities (`web-utils/auth-utilities.stories.tsx`)
- **redirectToAuthSpa** - Main auth redirect function
  - Login/logout flows
  - Cross-SPA synchronization
  - Iframe handling
- **handleLogout** - Complete logout handler
  - Cookie cleanup
  - Cross-SPA logout sync
- **Join/Signup Functions**
  - redirectToAuthSpaJoinTenant
  - getAuthSpaJoinUrl
- **Helper Functions**
  - isLoggedIn - Check authentication status
  - getPlatformKey - Extract tenant from URL
  - Cookie management utilities
  - Iframe detection helpers

### Web Containers
Stories documenting UI components:

#### Auth Buttons (`web-containers/auth-buttons.stories.tsx`)
- **LoginButton** - Versatile authentication button
  - Login flow handling
  - Tenant-specific login
  - Join/signup flow option
  - Custom redirect support
- **SignupButton** - Dedicated signup button
  - Registration flow
  - Tenant joining
  - New tab option
  - Custom post-signup redirects
- **Combined Usage** - Navigation bar patterns
  - Best practices
  - Landing page examples

#### UI Components (`web-containers/ui-components.stories.tsx`)
- **Profile Components**
  - Account settings
  - Security preferences
  - Billing management
- **Analytics Components**
  - AnalyticsOverview dashboard
  - Financial statistics
  - User engagement metrics
  - Custom stat cards
- **Notification Components**
  - NotificationDropdown
  - Toast notifications
- **Content Components**
  - Markdown renderer with syntax highlighting
  - RichTextEditor (WYSIWYG)
- **Loading Components**
  - Loader/Spinner variants

## 📝 Documentation Standards

Each story includes:

1. **Component/Hook Description** - What it does
2. **Props/Parameters** - Full TypeScript interfaces
3. **Return Values** - Complete return type documentation
4. **Code Examples** - Real-world usage examples
5. **Features List** - Key capabilities
6. **Best Practices** - Usage recommendations

## 🎯 Key Features

### Interactive Examples
- Live code previews in Storybook
- Syntax-highlighted code blocks
- Copy-paste ready examples

### TypeScript Support
- Full type definitions for all exports
- Interface documentation
- Type safety examples

### Real-World Patterns
- Complete application examples
- Error handling patterns
- Loading state management
- Optimistic updates
- Form validation

### Best Practices
- Provider composition order
- Cache management strategies
- Error recovery patterns
- Type safety guidelines

## 📁 File Organization

```
packages/iblai-js/src/
├── Introduction.mdx                    # Landing page with navigation
├── Usage.mdx                           # Setup and usage guide
├── Examples.mdx                        # Real-world application examples
├── data-layer/
│   └── hooks-rtk-query.stories.tsx    # RTK Query hooks patterns
├── web-utils/
│   ├── providers.stories.tsx          # Context providers
│   ├── hooks.stories.tsx              # Custom React hooks
│   ├── auth-utilities.stories.tsx     # Auth/session utilities
│   └── utils/
│       └── auth.ts                    # Auth utility functions
└── web-containers/
    ├── auth-buttons.stories.tsx       # Login/Signup buttons
    ├── ui-components.stories.tsx      # UI components
    └── components/
        └── auth-buttons/              # Auth button components
            ├── login-button.tsx
            ├── signup-button.tsx
            └── index.ts
```

## 🔧 Adding New Documentation

### For New Hooks

1. Create a new story file in the appropriate directory
2. Follow the existing pattern:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Category/Subcategory/Name',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Brief description',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExampleStory: Story = {
  render: () => (
    <div>
      {/* Documentation content */}
    </div>
  ),
};
```

3. Include:
   - TypeScript interfaces
   - Usage examples
   - Common patterns
   - Error handling

### For New Components

Follow the same pattern but include:
- Props interface
- Component variants
- Styling examples
- Accessibility notes

## 🌐 Publishing Documentation

### GitHub Pages

```bash
pnpm build-storybook
# Deploy storybook-static/ to GitHub Pages
```

### Netlify/Vercel

Connect the repository and set:
- Build command: `pnpm build-storybook`
- Publish directory: `storybook-static`

## 📦 Integration with Main SDK

The documentation is separate from the published package but references:

- `@iblai/data-layer@^0.3.1`
- `@iblai/web-utils@^0.2.1`
- `@iblai/web-containers@^0.2.1`

Users can view the documentation while developing with the SDK.

## 🤝 Contributing

To add or update documentation:

1. Create/edit story files following the established patterns
2. Test locally with `pnpm storybook`
3. Ensure all TypeScript interfaces are documented
4. Include practical examples
5. Update this README if adding new categories

## 📄 License

MIT © IBL AI
