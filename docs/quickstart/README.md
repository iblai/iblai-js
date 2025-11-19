# ibl.ai SDK - Quick Start Guide

Welcome to the ibl.ai JavaScript SDK! This guide will help you build React or Next.js applications using the ibl.ai ecosystem, including authentication, chat, user profiles, and more.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Core Concepts](#core-concepts)
4. [Authentication Setup](#authentication-setup)
5. [Building a Complete App](#building-a-complete-app)
6. [Chat Integration](#chat-integration)
7. [User Profile & Tenant Management](#user-profile--tenant-management)
8. [Available Components & Hooks](#available-components--hooks)
9. [Styling Guide](#styling-guide)
10. [Contributing to the SDK](#contributing-to-the-sdk)

---

## Overview

The ibl.ai SDK (`@iblai/iblai-js`) is a unified TypeScript SDK that provides:

- **Data Layer**: RTK Query API slices for all ibl.ai platform APIs
- **Web Utils**: React providers, hooks, and utilities
- **Web Containers**: Pre-built React UI components
- **Native Components**: React Native components (coming soon)

### Important Note on Authentication

**You do NOT need to implement authentication yourself!**

ibl.ai uses a specialized **Auth SPA** (Single Page Application) that handles all authentication methods:

- Magic link
- Username/password
- Google SSO
- Apple SSO

Your app simply redirects to the Auth SPA for login/signup, and the Auth SPA redirects back to your app at `/sso-login?data=<data>` with all the necessary tokens and user information.

---

## Installation

### From npm (Production)

```bash
npm install @iblai/iblai-js
# or
pnpm add @iblai/iblai-js
# or
yarn add @iblai/iblai-js
```

### From Local Development Environment

If you're developing the SDK locally or contributing to it:

```bash
# Clone the iblai-sdk repository
cd /path/to/iblai-sdk
pnpm install
pnpm build

# In your app
cd /path/to/your-app
pnpm add file:../iblai-sdk/packages/iblai-js
```

### Peer Dependencies

The SDK requires these peer dependencies:

```bash
npm install react react-dom @reduxjs/toolkit react-redux
```

### Styling

The SDK includes a pre-configured CSS design system with ibl.ai brand colors, components, and utilities.

#### Import Base Styles

Add this import to your app's entry point or global CSS:

```typescript
// app/layout.tsx (Next.js)
import '@iblai/iblai-js/styles/base.css';
```

Or in CSS:

```css
/* globals.css */
@import '@iblai/iblai-js/styles/base.css';
```

This provides:
- **CSS Variables**: All brand colors, spacing, and design tokens
- **Utility Classes**: Button, input, card, badge components
- **Chat Styles**: Pre-styled chat interface components
- **Responsive Design**: Mobile-first breakpoints

See the [Styling Guide](#styling-guide) section below for detailed usage.

---

## Core Concepts

### 1. Three-Layer Provider Structure

Every ibl.ai app uses three essential providers in this order:

1. **AuthProvider**: Handles authentication state and redirects
2. **TenantProvider**: Manages multi-tenancy and organization context
3. **MentorProvider**: Manages AI mentor selection and redirection

### 2. SSO Login Route

**Every SPA must expose a `/sso-login` route** to receive authentication callbacks from the Auth SPA.

### 3. Data Layer Initialization

The data layer must be initialized with your environment configuration before making API calls.

---

## Authentication Setup

### Step 1: Create Environment Configuration

Create a configuration file for your environment variables:

```typescript
// lib/config.ts
export const config = {
  authUrl: () => process.env.NEXT_PUBLIC_AUTH_URL || 'https://login.iblai.app',
  dmUrl: () => process.env.NEXT_PUBLIC_DM_URL || 'https://base.manager.iblai.app',
  lmsUrl: () => process.env.NEXT_PUBLIC_LMS_URL || 'https://learn.iblai.app',
  mainTenantKey: () => process.env.NEXT_PUBLIC_MAIN_TENANT_KEY || 'iblai',
  appName: 'your-app-name', // e.g., 'mentor', 'skills', 'my-custom-app'
};
```

### Step 2: Initialize Data Layer

```typescript
// lib/init-data-layer.ts
import { initializeDataLayer } from '@iblai/iblai-js';
import { config } from './config';

// Create a storage service for tokens
class LocalStorageService {
  private static instance: LocalStorageService;

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
}

export function setupDataLayer() {
  initializeDataLayer(config.dmUrl(), config.lmsUrl(), LocalStorageService.getInstance(), {
    401: () => {
      // Redirect to auth SPA on unauthorized
      console.log('[auth-redirect] API returned 401 Unauthorized');
      window.location.href = `${config.authUrl()}/login?app=${config.appName}&redirect-to=${window.location.origin}`;
    },
    402: () => {
      // Handle subscription/billing errors
      console.log('[billing] Subscription limit reached');
    },
  });
}
```

### Step 3: Create the SSO Login Page

This is the **most important page** - it receives the authentication callback.

#### Next.js App Router

```typescript
// app/sso-login/page.tsx
'use client';

import React, { Suspense } from 'react';
import { SsoLogin } from '@iblai/iblai-js';

const LOCAL_STORAGE_KEYS = {
  CURRENT_TENANT: 'current_tenant',
  USER_DATA: 'user_data',
  TENANTS: 'tenants',
};

function SsoLoginContent() {
  return (
    <SsoLogin
      localStorageKeys={{
        CURRENT_TENANT: LOCAL_STORAGE_KEYS.CURRENT_TENANT,
        USER_DATA: LOCAL_STORAGE_KEYS.USER_DATA,
        TENANTS: LOCAL_STORAGE_KEYS.TENANTS,
      }}
      redirectPathKey="redirect-to"
      defaultRedirectPath="/"
    />
  );
}

export default function SsoLoginPage() {
  return (
    <Suspense fallback={null}>
      <SsoLoginContent />
    </Suspense>
  );
}
```

#### React Router

```typescript
// pages/SsoLogin.tsx
import React from 'react';
import { SsoLogin } from '@iblai/iblai-js';

const LOCAL_STORAGE_KEYS = {
  CURRENT_TENANT: 'current_tenant',
  USER_DATA: 'user_data',
  TENANTS: 'tenants',
};

export function SsoLoginPage() {
  return (
    <SsoLogin
      localStorageKeys={{
        CURRENT_TENANT: LOCAL_STORAGE_KEYS.CURRENT_TENANT,
        USER_DATA: LOCAL_STORAGE_KEYS.USER_DATA,
        TENANTS: LOCAL_STORAGE_KEYS.TENANTS,
      }}
      redirectPathKey="redirect-to"
      defaultRedirectPath="/"
    />
  );
}
```

### Step 4: Add Login and Signup Buttons

Use the pre-built `LoginButton` and `SignupButton` components:

```typescript
import { LoginButton, SignupButton } from '@iblai/iblai-js';
import { config } from '@/lib/config';

export function AuthButtons() {
  return (
    <div className="flex gap-4">
      <LoginButton
        authUrl={config.authUrl()}
        appName={config.appName}
        label="Log In"
      />

      <SignupButton
        authUrl={config.authUrl()}
        appName={config.appName}
        label="Sign Up"
        variant="outline"
      />
    </div>
  );
}
```

**That's it for authentication!** The Auth SPA handles all the complexity:

- Magic link emails
- Google OAuth
- Apple OAuth
- Username/password validation
- Token management
- Multi-tenancy

---

## Building a Complete App

Here's a complete example of setting up a Next.js app with all providers:

### Directory Structure

```
your-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── sso-login/
│   │   └── page.tsx
│   └── platform/
│       └── [tenantKey]/
│           └── [mentorId]/
│               └── page.tsx
├── providers/
│   └── index.tsx
├── lib/
│   ├── config.ts
│   ├── init-data-layer.ts
│   └── utils.ts
└── hooks/
    └── use-user.ts
```

### Root Layout

```typescript
// app/layout.tsx
import { StoreProvider } from '@/providers/store-provider';
import Providers from '@/providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Providers>{children}</Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
```

### Store Provider

```typescript
// providers/store-provider.tsx
'use client';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '@iblai/iblai-js'; // Main API slice from data layer

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Add your custom reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

### Main Providers Component

```typescript
// providers/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  AuthProvider,
  TenantProvider,
  MentorProvider,
} from '@iblai/iblai-js';
import { setupDataLayer } from '@/lib/init-data-layer';
import { config } from '@/lib/config';
import { useUserData } from '@/hooks/use-user';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const params = useParams();

  // Get user data from localStorage
  const {
    username,
    isAdmin,
    currentTenant,
    tenants,
    saveCurrentTenant,
    saveTenants,
    saveVisitingTenant,
    removeVisitingTenant,
  } = useUserData();

  // Initialize data layer on mount
  useEffect(() => {
    setupDataLayer();
    setReady(true);
  }, []);

  if (!ready) return <div>Loading...</div>;

  // Check if user has non-expired tokens
  function hasNonExpiredAuthToken(): boolean {
    const dmTokenExpires = localStorage.getItem('dm_token_expires');
    if (!dmTokenExpires) return false;
    return new Date(dmTokenExpires) > new Date();
  }

  // Redirect to auth SPA
  function redirectToAuthSpa(
    redirectTo?: string,
    platformKey?: string,
    logout = false
  ) {
    const redirect = redirectTo || window.location.pathname;
    const url = new URL(`${config.authUrl()}/login`);
    url.searchParams.set('app', config.appName);
    url.searchParams.set('redirect-to', `${window.location.origin}${redirect}`);
    if (platformKey) url.searchParams.set('platform_key', platformKey);
    if (logout) {
      url.searchParams.set('enforce_logout', '1');
      url.searchParams.set('logout', '1');
    }
    window.location.href = url.toString();
  }

  // Handle tenant switching
  async function handleTenantSwitch(tenant: string, saveRedirect: boolean) {
    saveCurrentTenant(tenant);
    if (saveRedirect) {
      localStorage.setItem('redirect_after_tenant_switch', window.location.pathname);
    }
    router.push(`/platform/${tenant}`);
  }

  // Mentor provider callbacks
  function redirectToNoMentorsPage() {
    router.push(`/platform/${currentTenant}/explore`);
  }

  function redirectToCreateMentor() {
    router.push('/create-mentor');
  }

  function redirectToMentor(tenantKey: string, mentorId: string) {
    router.push(`/platform/${tenantKey}/${mentorId}`);
  }

  function onLoadMentorsPermissions(permissions: Record<string, unknown> | undefined) {
    // Store permissions in your state management
    console.log('Loaded mentor permissions:', permissions);
  }

  // Define public routes that don't require authentication
  const middleware = new Map();

  middleware.set(/^\/sso-login/, () => false);
  middleware.set(/^\/error\/\d+/, () => false);
  middleware.set(/^\/public/, () => false);

  return (
    <AuthProvider
      redirectToAuthSpa={redirectToAuthSpa}
      hasNonExpiredAuthToken={hasNonExpiredAuthToken}
      username={username || ''}
      middleware={middleware}
      pathname={window.location.pathname}
      fallback={<div>Authenticating...</div>}
    >
      <TenantProvider
        currentTenant={currentTenant || ''}
        requestedTenant={(params.tenantKey as string) || ''}
        saveCurrentTenant={saveCurrentTenant}
        saveUserTenants={saveTenants}
        handleTenantSwitch={handleTenantSwitch}
        saveVisitingTenant={saveVisitingTenant}
        removeVisitingTenant={removeVisitingTenant}
        fallback={<div>Loading tenant...</div>}
      >
        <MentorProvider
          redirectToAuthSpa={redirectToAuthSpa}
          username={username || ''}
          isAdmin={isAdmin}
          mainTenantKey={config.mainTenantKey()}
          redirectToNoMentorsPage={redirectToNoMentorsPage}
          redirectToCreateMentor={redirectToCreateMentor}
          redirectToMentor={redirectToMentor}
          onLoadMentorsPermissions={onLoadMentorsPermissions}
          requestedMentorId={(params.mentorId as string) || undefined}
          fallback={<div>Loading mentor...</div>}
        >
          {children}
        </MentorProvider>
      </TenantProvider>
    </AuthProvider>
  );
}
```

### User Data Hook

```typescript
// hooks/use-user.ts
import { useState, useEffect } from 'react';

interface UserData {
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  tenants: Array<{ key: string; name: string }>;
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentTenant, setCurrentTenant] = useState<string>('');

  useEffect(() => {
    // Load from localStorage
    const data = localStorage.getItem('user_data');
    const tenant = localStorage.getItem('current_tenant');

    if (data) setUserData(JSON.parse(data));
    if (tenant) setCurrentTenant(tenant);
  }, []);

  return {
    username: userData?.username || '',
    email: userData?.email || '',
    isAdmin: userData?.is_staff || userData?.is_superuser || false,
    currentTenant,
    tenants: userData?.tenants || [],
    saveCurrentTenant: (tenant: string) => {
      localStorage.setItem('current_tenant', tenant);
      setCurrentTenant(tenant);
    },
    saveTenants: (tenants: Array<{ key: string; name: string }>) => {
      const updated = { ...userData, tenants };
      localStorage.setItem('user_data', JSON.stringify(updated));
      setUserData(updated as UserData);
    },
    saveVisitingTenant: (tenant: string) => {
      localStorage.setItem('visiting_tenant', tenant);
    },
    removeVisitingTenant: () => {
      localStorage.removeItem('visiting_tenant');
    },
  };
}
```

---

## Chat Integration

### Understanding Chat in ibl.ai

**You do NOT need LLM credentials!** The ibl.ai platform handles all LLM communication through WebSocket connections. Your app simply:

1. Uses the `useAdvancedChat` hook to manage chat state
2. Renders messages using the Chat component or custom UI
3. Sends/receives messages through the SDK

### Basic Chat Implementation

```typescript
// components/ChatInterface.tsx
'use client';

import { useAdvancedChat } from '@iblai/iblai-js';
import { config } from '@/lib/config';
import { useUserData } from '@/hooks/use-user';

interface ChatInterfaceProps {
  tenantKey: string;
  mentorId: string;
}

export function ChatInterface({ tenantKey, mentorId }: ChatInterfaceProps) {
  const { username } = useUserData();
  const token = localStorage.getItem('dm_token') || '';

  const {
    chats,
    activeTab,
    streaming,
    sendMessage,
    stopGeneration,
    changeTab,
    startNewChat,
    retry,
    deleteMessage,
  } = useAdvancedChat({
    tenantKey,
    mentorId,
    username: username || 'anonymous',
    token,
    wsUrl: `${config.dmUrl()}/ws/chat/`,
    stopGenerationWsUrl: `${config.dmUrl()}/ws/stop/`,
    redirectToAuthSpa: (redirectTo, platformKey, logout) => {
      window.location.href = `${config.authUrl()}/login?app=${config.appName}&redirect-to=${window.location.origin}`;
    },
    errorHandler: (message, error) => {
      console.error('Chat error:', message, error);
    },
  });

  const handleSendMessage = async (content: string) => {
    await sendMessage({
      content,
      role: 'user',
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {chats[activeTab]?.messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {streaming && <div className="text-gray-500">AI is typing...</div>}
      </div>

      {/* Chat Input */}
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
            if (input.value.trim()) {
              handleSendMessage(input.value);
              input.value = '';
            }
          }}
        >
          <div className="flex gap-2">
            <input
              name="message"
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg"
              disabled={streaming}
            />
            <button
              type="submit"
              disabled={streaming}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### Advanced Chat Features

The `useAdvancedChat` hook provides many advanced features:

```typescript
const {
  // State
  chats,                      // All chat sessions
  activeTab,                  // Currently active chat tab
  streaming,                  // Is AI currently responding
  currentStreamingMessage,    // Current message being streamed
  sessionId,                  // Current session ID
  isPending,                  // Is a message pending
  isStopped,                  // Has generation been stopped
  isError,                    // Is there an error

  // Actions
  sendMessage,                // Send a new message
  stopGeneration,             // Stop AI generation
  changeTab,                  // Switch between chat tabs
  startNewChat,               // Start a new chat session
  retry,                      // Retry a failed message
  deleteMessage,              // Delete a message
  regenerate,                 // Regenerate last AI response
  editMessage,                // Edit a message

  // Tools (if mentor has tools enabled)
  mentorTools,                // Available mentor tools
  submitToolResult,           // Submit tool execution result
} = useAdvancedChat({ ... });
```

### Sending Messages with Files

```typescript
import { useAdvancedChat } from '@iblai/iblai-js';
import { useDispatch } from 'react-redux';
import { addFile, clearFiles } from '@iblai/iblai-js';

function ChatWithFiles() {
  const dispatch = useDispatch();
  const { sendMessage } = useAdvancedChat({ /* config */ });

  const handleFileUpload = async (files: File[]) => {
    // Upload files and add to state
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      // Upload file using data layer
      const response = await fetch(`${config.dmUrl()}/api/upload/`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('dm_token')}`,
        },
      });

      const data = await response.json();

      // Add file reference to state
      dispatch(addFile({
        id: data.id,
        name: file.name,
        url: data.url,
        type: file.type,
      }));
    }
  };

  const handleSendWithFiles = async (content: string) => {
    await sendMessage({
      content,
      role: 'user',
      // Files are automatically included from Redux state
    });

    // Clear files after sending
    dispatch(clearFiles());
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(Array.from(e.target.files));
          }
        }}
      />
      {/* Rest of chat UI */}
    </div>
  );
}
```

---

## User Profile & Tenant Management

### User Profile Component

```typescript
import { UserProfileDropdown } from '@iblai/iblai-js';
import { config } from '@/lib/config';

export function Header() {
  const { username, email, currentTenant, tenants } = useUserData();

  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>

      <UserProfileDropdown
        username={username}
        email={email}
        tenants={tenants}
        currentTenant={currentTenant}
        onTenantSwitch={(tenant) => {
          // Handle tenant switch
          window.location.href = `/platform/${tenant}`;
        }}
        onLogout={() => {
          localStorage.clear();
          window.location.href = `${config.authUrl()}/logout?app=${config.appName}`;
        }}
      />
    </header>
  );
}
```

### Tenant Switcher

```typescript
import { TenantSwitch } from '@iblai/iblai-js';

export function TenantSwitcher() {
  const { tenants, currentTenant } = useUserData();

  return (
    <TenantSwitch
      tenants={tenants}
      currentTenant={currentTenant}
      onSwitch={(tenant) => {
        localStorage.setItem('current_tenant', tenant);
        window.location.href = `/platform/${tenant}`;
      }}
    />
  );
}
```

---

## Available Components & Hooks

### Components (from `@iblai/iblai-js`)

#### Authentication

- `LoginButton` - Pre-built login button
- `SignupButton` - Pre-built signup button
- `SsoLogin` - SSO login handler component

#### User Interface

- `UserProfileDropdown` - User profile menu with tenant switcher
- `TenantSwitch` - Tenant switching component
- `InviteUser` - Invite users to organization
- `InvitedUsers` - Display invited users list

#### Chat & Messaging

- `Chat` - Full-featured chat component (use with `useAdvancedChat`)
- `ChatMessages` - Display chat messages
- `ChatInputForm` - Chat input with file upload
- `LoadingMessage` - Loading indicator for AI responses

#### Utilities

- `Spinner` - Loading spinner
- `ErrorPage` - Error display page
- `ClientErrorPage` - Client-side error handler
- `RichTextEditor` - Rich text input component
- `SearchableMultiselect` - Searchable dropdown with multi-select
- `Markdown` - Markdown renderer

### Hooks (from `@iblai/iblai-js`)

#### Chat

- `useAdvancedChat` - Main chat hook with WebSocket management
- `useMentorTools` - Access mentor tools and capabilities
- `useChatV2` - Alternative chat hook

#### Authentication & User

- `useUserProfileUpdate` - Update user profile
- `useProfileImageUpload` - Upload profile image

#### Subscription & Billing

- `useSubscriptionHandler` - Handle subscription logic
- `useExternalPricingPlan` - External pricing integration

#### Tenant & Metadata

- `useTenantMetadata` - Access tenant configuration
- `useMentorSettings` - Access mentor settings

#### Utilities

- `useDayJs` - Date formatting utility

### Data Layer Hooks (RTK Query)

All API hooks follow the pattern `use[Entity][Action]Query/Mutation`:

#### Mentors

- `useGetMentorsQuery` - Fetch mentors list
- `useGetMentorPublicSettingsQuery` - Fetch public mentor settings
- `useLazyGetMentorsQuery` - Lazy fetch mentors
- `useCreateMentorMutation` - Create a mentor
- `useUpdateMentorMutation` - Update mentor
- `useSeedMentorsMutation` - Seed default mentors

#### Chat

- `useGetChatHistoryQuery` - Fetch chat history
- `useCreateSessionIdMutation` - Create chat session
- `useDeleteChatMutation` - Delete chat
- `useShareChatMutation` - Share chat link

#### User

- `useGetUserProfileQuery` - Fetch user profile
- `useUpdateUserProfileMutation` - Update user profile
- `useUploadProfileImageMutation` - Upload profile image

#### Tenant

- `useGetTenantsQuery` - Fetch user's tenants
- `useGetTenantMetadataQuery` - Fetch tenant configuration
- `useSwitchTenantMutation` - Switch active tenant

#### Files

- `useUploadFileMutation` - Upload file to chat
- `useDeleteFileMutation` - Delete uploaded file

#### And many more! See the full list in the data layer exports.

---

## Styling Guide

The SDK includes a comprehensive CSS design system at `@iblai/iblai-js/styles/base.css`.

### Quick Start with Styles

Import in your app's entry point:

```typescript
// Next.js: app/layout.tsx
import '@iblai/iblai-js/styles/base.css';

// React: src/index.tsx or src/App.tsx
import '@iblai/iblai-js/styles/base.css';
```

### CSS Variables

All IBL AI brand colors and design tokens are available as CSS variables:

#### Brand Colors

```css
var(--primary-color)        /* #0058cc - Primary brand blue */
var(--primary-light)        /* #00b0ef - Light blue accent */
var(--primary-dark)         /* #004499 - Dark blue */
var(--accent-color)         /* #f6f8fe - Light background accent */
var(--gradient-bg)          /* Brand gradient (blue gradient) */
```

#### Text Colors

```css
var(--text-primary)         /* #616a76 - Primary text */
var(--text-secondary)       /* #717985 - Secondary text */
var(--text-muted)           /* #9ca3af - Muted/disabled text */
```

#### Status Colors

```css
var(--success-color)        /* #10b981 - Success green */
var(--warning-color)        /* #f59e0b - Warning orange */
var(--error-color)          /* #ef4444 - Error red */
var(--info-color)           /* #3b82f6 - Info blue */
```

### Using CSS Variables

```typescript
// In your component
<div style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
  Branded Element
</div>

// Or in CSS
.my-custom-button {
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius-lg);
}
```

### Pre-Built Component Classes

#### Buttons

```html
<!-- Primary button -->
<button className="btn btn-primary">Click Me</button>

<!-- Secondary button -->
<button className="btn btn-secondary">Cancel</button>

<!-- Ghost button -->
<button className="btn btn-ghost">More Options</button>
```

#### Inputs

```html
<input type="text" className="input" placeholder="Enter text..." />
```

#### Cards

```html
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

#### Badges

```html
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Failed</span>
```

#### Links

```html
<a href="#" className="link">Learn more</a>
```

### Utility Classes

#### Backgrounds

```html
<div className="bg-primary">Primary background</div>
<div className="bg-gradient-brand">Gradient background</div>
<div className="bg-card shadow-lg">Card with shadow</div>
```

#### Text

```html
<p className="text-text-primary">Primary text</p>
<p className="text-text-secondary">Secondary text</p>
<h1 className="text-brand-gradient">Gradient text</h1>
```

#### Borders

```html
<div className="border-color rounded-lg">
  Bordered element
</div>
```

#### Shadows

```html
<div className="shadow-sm">Small shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>
```

### Chat-Specific Styles

Special classes for chat interfaces:

```html
<!-- Chat input -->
<input type="text" className="chat-input" placeholder="Type a message..." />

<!-- Chat buttons -->
<button className="chat-button-primary">Send</button>
<button className="chat-button-secondary">Cancel</button>
```

### Example: Styled Login Page

```typescript
import '@iblai/iblai-js/styles/base.css';
import { LoginButton } from '@iblai/iblai-js';

export function LoginPage() {
  return (
    <div className="bg-gradient-brand" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card shadow-xl" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-brand-gradient" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Welcome Back
        </h1>
        <p className="text-text-secondary" style={{ marginBottom: '2rem' }}>
          Sign in to continue to your account
        </p>
        <LoginButton
          authUrl="https://login.iblai.app"
          appName="my-app"
          label="Sign In"
          className="btn btn-primary"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
```

### Customizing Colors

Override any CSS variable in your own stylesheet:

```css
/* custom-theme.css */
:root {
  --primary-color: #your-brand-color;
  --accent-color: #your-accent;
  /* Override any variable */
}
```

Then import both stylesheets:

```typescript
import '@iblai/iblai-js/styles/base.css';
import './custom-theme.css';
```

### Dark Mode

Basic dark mode support is included:

```html
<html className="dark-mode">
  <body>
    <!-- Your app -->
  </body>
</html>
```

### Complete Style Reference

For a complete list of all CSS variables and utility classes, see:
- [Base CSS Source](https://github.com/iblai/iblai-sdk/blob/main/packages/iblai-js/src/web-containers/styles/base.css)
- [Web Containers Styles README](https://github.com/iblai/iblai-sdk/blob/main/packages/iblai-js/src/web-containers/styles/README.md)

---

## Contributing to the SDK

### Local Development Setup

1. **Clone the repository**:

```bash
git clone https://github.com/iblai/iblai-sdk.git
cd iblai-sdk
```

2. **Install dependencies**:

```bash
pnpm install
```

3. **Build the SDK**:

```bash
pnpm build
```

4. **Watch mode for development**:

```bash
pnpm watch
```

5. **Link to your app**:

```bash
# In iblai-sdk directory
pnpm link --global

# In your app directory
pnpm link --global @iblai/iblai-js
```

### Project Structure

```
iblai-sdk/
├── packages/
│   └── iblai-js/
│       └── src/
│           ├── data-layer/     # Re-exports from @iblai/data-layer
│           ├── web-utils/      # Re-exports from @iblai/web-utils
│           ├── web-containers/ # Re-exports from @iblai/web-containers
│           └── index.ts        # Main entry point
└── README.md
```

The SDK is a thin wrapper that re-exports from three main packages:

- `@iblai/data-layer` - RTK Query API slices
- `@iblai/web-utils` - React providers, hooks, utilities
- `@iblai/web-containers` - React UI components

### Adding New Features

#### Adding a New Component

1. Add component to `web-containers`:

```typescript
// packages/iblai-js/src/web-containers/components/my-component.tsx
export function MyComponent() {
  return <div>My Component</div>;
}
```

2. Export from index:

```typescript
// packages/iblai-js/src/web-containers/index.ts
export * from './components/my-component';
```

#### Adding a New Hook

1. Add hook to `web-utils`:

```typescript
// packages/iblai-js/src/web-utils/hooks/use-my-hook.ts
export function useMyHook() {
  // Hook logic
}
```

2. Export from index:

```typescript
// packages/iblai-js/src/web-utils/hooks/index.ts
export * from './use-my-hook';
```

#### Adding a New API Endpoint

1. Add API slice to `data-layer`:

```typescript
// packages/iblai-js/src/data-layer/features/my-feature/api-slice.ts
import { apiSlice } from '../core/api-slice';

export const myFeatureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyData: builder.query({
      query: (id) => `/api/my-data/${id}/`,
    }),
  }),
});

export const { useGetMyDataQuery } = myFeatureApi;
```

2. Export from index:

```typescript
// packages/iblai-js/src/data-layer/index.ts
export * from './features/my-feature/api-slice';
```

### Testing

Run tests:

```bash
pnpm test
```

Type checking:

```bash
pnpm typecheck
```

### Publishing

The SDK uses changesets for version management:

```bash
# Create a changeset
pnpm changeset

# Version packages
pnpm changeset:version

# Publish to npm
pnpm changeset:publish
```

---

## Complete Example App

Here's a minimal but complete Next.js app:

```typescript
// app/page.tsx
'use client';

import { LoginButton, useAdvancedChat } from '@iblai/iblai-js';
import { useUserData } from '@/hooks/use-user';
import { config } from '@/lib/config';

export default function HomePage() {
  const { username } = useUserData();

  if (!username) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Welcome to My App</h1>
          <LoginButton
            authUrl={config.authUrl()}
            appName={config.appName}
            label="Get Started"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1>Welcome, {username}!</h1>
      <ChatInterface tenantKey="my-tenant" mentorId="my-mentor" />
    </div>
  );
}

function ChatInterface({ tenantKey, mentorId }: { tenantKey: string; mentorId: string }) {
  const { username } = useUserData();
  const token = localStorage.getItem('dm_token') || '';

  const { chats, activeTab, streaming, sendMessage } = useAdvancedChat({
    tenantKey,
    mentorId,
    username: username || 'anonymous',
    token,
    wsUrl: `${config.dmUrl()}/ws/chat/`,
    stopGenerationWsUrl: `${config.dmUrl()}/ws/stop/`,
    redirectToAuthSpa: () => {
      window.location.href = `${config.authUrl()}/login?app=${config.appName}`;
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4">
        {chats[activeTab]?.messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-4 py-2 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        className="w-full px-4 py-2 border rounded-lg"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value) {
            sendMessage({ content: e.currentTarget.value, role: 'user' });
            e.currentTarget.value = '';
          }
        }}
        disabled={streaming}
      />
    </div>
  );
}
```

---

## Frequently Asked Questions

### Q: Do I need to implement authentication myself?

**No!** Use the Auth SPA and the pre-built `LoginButton`/`SignupButton` components.

### Q: Do I need LLM API keys or credentials?

**No!** The ibl.ai platform handles all LLM communication. Just use `useAdvancedChat` hook.

### Q: How do I handle magic link authentication?

The Auth SPA handles it. You just redirect users there with the `LoginButton` component.

### Q: How do I switch between tenants/organizations?

Use the `TenantProvider` and `TenantSwitch` component, or call the tenant switch handler.

### Q: Can I use this with React Router instead of Next.js?

Yes! The SDK is framework-agnostic. Just adapt the routing logic.

### Q: How do I access mentor settings?

Use the `useMentorSettings` hook or `useGetMentorPublicSettingsQuery`.

### Q: How do I handle file uploads in chat?

Use the file upload mutation and add files to Redux state before sending messages.

---

## Resources

- **GitHub**: https://github.com/iblai/iblai-sdk
- **Issues**: https://github.com/iblai/iblai-sdk/issues
- **NPM**: https://www.npmjs.com/package/@iblai/iblai-js
- **Documentation**: https://docs.iblai.app

---

## Support

For questions or issues:

1. Check this guide first
2. Search existing GitHub issues
3. Create a new issue with details
4. Contact the team at dev@ibl.ai

Happy building! 🚀
