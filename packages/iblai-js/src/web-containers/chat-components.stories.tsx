import type { Meta, StoryObj } from '@storybook/react';

/**
 * # Chat Components Guide
 *
 * Comprehensive guide for building chat user interfaces using IBL AI SDK hooks and components.
 * This documentation provides implementation patterns and best practices for creating
 * chat applications with AI mentors.
 *
 * ## Overview
 *
 * The IBL AI SDK provides powerful hooks and utilities for building chat interfaces,
 * but does not prescribe specific UI components. This gives you flexibility to:
 *
 * - Build custom chat UIs that match your design system
 * - Use any UI framework (Tailwind, Material-UI, Ant Design, etc.)
 * - Implement platform-specific designs (web, mobile, desktop)
 *
 * ## Key Building Blocks
 *
 * ### Hooks from @iblai/web-utils:
 * - `useAdvancedChat` - Main hook with tabs, sessions, streaming
 * - `useChatV2` - Core WebSocket chat implementation
 * - `useGetChatDetails` - Fetch chat history (RTK Query)
 * - `useMentorTools` - Manage AI tools (web browsing, code interpreter)
 *
 * ### Components from @iblai/web-containers:
 * - Base UI components: Button, Input, Avatar, Dialog, etc.
 * - Markdown renderer with syntax highlighting
 * - Loading indicators and spinners
 *
 * ### Data Types:
 * ```typescript
 * interface Message {
 *   role: 'user' | 'assistant';
 *   content: string;
 *   visible: boolean;
 *   timestamp?: string;
 *   fileAttachments?: FileAttachment[];
 * }
 *
 * interface FileAttachment {
 *   fileName: string;
 *   fileUrl: string;
 *   fileType: string;
 * }
 * ```
 */
const meta = {
  title: 'Web Containers/Chat Components',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Patterns and examples for building chat UIs with IBL AI SDK.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## useAdvancedChat Hook
 *
 * The primary hook for building chat interfaces with streaming, tabs, and session management.
 *
 * ### Hook API
 *
 * ```typescript
 * import { useAdvancedChat } from '@iblai/iblai-js';
 *
 * const {
 *   // Message state
 *   messages,                    // Array<Message> - All messages in current session
 *   currentStreamingMessage,     // Message | null - Currently streaming message
 *
 *   // Actions
 *   sendMessage,                 // (tab, content, options) => void
 *   stopGenerating,              // () => void - Stop AI response
 *   setMessage,                  // (content) => void - Set input value
 *
 *   // UI state
 *   isStreaming,                 // boolean - AI is generating response
 *   isPending,                   // boolean - Waiting for response
 *   sessionId,                   // string - Current session ID
 *
 *   // Mentor info
 *   mentorName,                  // string - AI mentor name
 *   profileImage,                // string - Mentor avatar URL
 *
 *   // Tab management
 *   activeTab,                   // string - Current active tab
 *   changeTab,                   // (tab: string) => void
 * } = useAdvancedChat({
 *   mentorId: 'mentor-123',
 *   mode: 'advanced',
 *   tenantKey: 'my-organization',
 *   username: 'user@example.com',
 *   token: 'auth-token',
 *   wsUrl: 'wss://api.iblai.app/ws/langflow/',
 *   stopGenerationWsUrl: 'wss://api.iblai.app/ws/langflow-stop-generation/',
 *   redirectToAuthSpa: (redirectTo?: string) => {
 *     window.location.href = `/login?redirect=${redirectTo}`;
 *   },
 * });
 * ```
 *
 * ### Basic Usage Example
 *
 * ```tsx
 * import { useAdvancedChat } from '@iblai/iblai-js';
 *
 * function ChatInterface() {
 *   const {
 *     messages,
 *     sendMessage,
 *     isStreaming,
 *     stopGenerating,
 *     mentorName,
 *     profileImage,
 *   } = useAdvancedChat({
 *     mentorId: 'mentor-123',
 *     mode: 'advanced',
 *     tenantKey: 'my-org',
 *     username: 'user123',
 *     token: 'auth-token',
 *     wsUrl: 'wss://api.iblai.app/ws/langflow/',
 *     stopGenerationWsUrl: 'wss://api.iblai.app/ws/langflow-stop-generation/',
 *     redirectToAuthSpa: (redirectTo) => {
 *       window.location.href = `/auth?redirect=${redirectTo}`;
 *     },
 *   });
 *
 *   const handleSendMessage = (content: string) => {
 *     sendMessage('chat', content, { visible: true });
 *   };
 *
 *   return (
 *     <div>
 *       <MessageList messages={messages} />
 *       <ChatInput
 *         onSend={handleSendMessage}
 *         isStreaming={isStreaming}
 *         onStop={stopGenerating}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * ### Hook Parameters
 *
 * | Parameter | Type | Required | Description |
 * |-----------|------|----------|-------------|
 * | `mentorId` | string | Yes | AI mentor identifier |
 * | `mode` | 'basic' \| 'advanced' | Yes | Chat mode |
 * | `tenantKey` | string | Yes | Organization/tenant key |
 * | `username` | string | Yes | Current user identifier |
 * | `token` | string | Yes | Authentication token |
 * | `wsUrl` | string | Yes | WebSocket URL for chat |
 * | `stopGenerationWsUrl` | string | Yes | WebSocket URL for stopping |
 * | `redirectToAuthSpa` | function | Yes | Auth redirect handler |
 *
 * ### Return Values
 *
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | `messages` | Message[] | All messages in session |
 * | `sendMessage` | function | Send a new message |
 * | `isStreaming` | boolean | AI is currently responding |
 * | `isPending` | boolean | Waiting for AI response |
 * | `stopGenerating` | function | Stop AI response generation |
 * | `sessionId` | string | Current session ID |
 * | `mentorName` | string | AI mentor display name |
 * | `profileImage` | string | Mentor avatar URL |
 * | `activeTab` | string | Current active tab |
 * | `changeTab` | function | Switch between tabs |
 * | `currentStreamingMessage` | Message \| null | Message being streamed |
 * | `setMessage` | function | Set input field value |
 */
export const UseAdvancedChatHook: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>useAdvancedChat Hook</h3>

      <h4>Basic Setup</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { useAdvancedChat } from '@iblai/iblai-js';

function ChatApp() {
  const chat = useAdvancedChat({
    mentorId: 'mentor-123',
    mode: 'advanced',
    tenantKey: 'my-org',
    username: 'user@example.com',
    token: 'auth-token',
    wsUrl: 'wss://api.iblai.app/ws/langflow/',
    stopGenerationWsUrl: 'wss://api.iblai.app/ws/langflow-stop-generation/',
    redirectToAuthSpa: (redirectTo) => {
      window.location.href = \`/login?redirect=\${redirectTo}\`;
    },
  });

  // chat.messages - all messages
  // chat.sendMessage - send new message
  // chat.isStreaming - is AI responding
  // chat.mentorName - mentor display name
  // chat.profileImage - mentor avatar

  return <YourChatUI {...chat} />;
}`}
      </pre>

      <h4>Sending Messages</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// Send a text message
chat.sendMessage('chat', 'Hello!', { visible: true });

// Send with file attachments
chat.sendMessage('chat', 'Check this file', {
  visible: true,
  fileAttachments: [
    {
      fileName: 'document.pdf',
      fileUrl: 'https://...',
      fileType: 'application/pdf'
    }
  ]
});

// Stop generation
chat.stopGenerating();`}
      </pre>

      <p><strong>Key Features:</strong></p>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Real-time streaming responses</li>
        <li>WebSocket-based communication</li>
        <li>Session management</li>
        <li>Multi-tab support (Chat, Research, Code)</li>
        <li>File attachment support</li>
        <li>Stop generation capability</li>
        <li>Automatic reconnection</li>
      </ul>
    </div>
  ),
};

/**
 * ## Building Message Components
 *
 * Guide for creating message bubble components to display chat messages.
 *
 * ### Message Interface
 *
 * ```typescript
 * interface Message {
 *   role: 'user' | 'assistant';
 *   content: string;
 *   visible: boolean;
 *   timestamp?: string;
 *   fileAttachments?: FileAttachment[];
 * }
 * ```
 *
 * ### AI Message Component Example
 *
 * ```tsx
 * import { Avatar, AvatarImage, AvatarFallback, Markdown } from '@iblai/iblai-js';
 *
 * interface AIMessageProps {
 *   content: string;
 *   mentorName: string;
 *   profileImage: string;
 *   timestamp?: string;
 *   onRetry?: () => void;
 * }
 *
 * export function AIMessage({
 *   content,
 *   mentorName,
 *   profileImage,
 *   timestamp,
 *   onRetry
 * }: AIMessageProps) {
 *   return (
 *     <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start' }}>
 *       <Avatar style={{ width: '32px', height: '32px', marginRight: '12px' }}>
 *         <AvatarImage src={profileImage} alt={mentorName} />
 *         <AvatarFallback>{mentorName.slice(0, 2)}</AvatarFallback>
 *       </Avatar>
 *
 *       <div style={{ flex: 1 }}>
 *         <div style={{ marginBottom: '4px' }}>
 *           <span style={{ fontWeight: 500 }}>{mentorName}</span>
 *           {timestamp && (
 *             <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
 *               {timestamp}
 *             </span>
 *           )}
 *         </div>
 *
 *         <Markdown content={content} />
 *
 *         {onRetry && (
 *           <button onClick={onRetry} style={{ fontSize: '12px', marginTop: '4px' }}>
 *             Retry
 *           </button>
 *         )}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * ### User Message Component Example
 *
 * ```tsx
 * interface UserMessageProps {
 *   content: string;
 *   fileAttachments?: FileAttachment[];
 * }
 *
 * export function UserMessage({ content, fileAttachments }: UserMessageProps) {
 *   return (
 *     <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
 *       <div style={{ maxWidth: '80%' }}>
 *         {fileAttachments?.map((file, idx) => (
 *           <div key={idx} style={{ marginBottom: '8px', padding: '8px', border: '1px solid #ddd' }}>
 *             {file.fileName}
 *           </div>
 *         ))}
 *
 *         {content && (
 *           <div style={{ padding: '12px', background: '#f0f0f0', borderRadius: '8px' }}>
 *             {content}
 *           </div>
 *         )}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export const MessageComponents: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Message Components</h3>

      <h4>AI Message Component</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { Avatar, Markdown } from '@iblai/iblai-js';

function AIMessage({ content, mentorName, profileImage }) {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Avatar>
        <img src={profileImage} alt={mentorName} />
      </Avatar>
      <div>
        <strong>{mentorName}</strong>
        <Markdown content={content} />
      </div>
    </div>
  );
}`}
      </pre>

      <h4>User Message Component</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`function UserMessage({ content, fileAttachments }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div>
        {fileAttachments?.map((file) => (
          <div key={file.fileName}>{file.fileName}</div>
        ))}
        <div>{content}</div>
      </div>
    </div>
  );
}`}
      </pre>

      <p><strong>Component Features:</strong></p>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Avatar with fallback (AI messages)</li>
        <li>Markdown rendering for formatted content</li>
        <li>File attachment display</li>
        <li>Timestamp display</li>
        <li>Action buttons (retry, copy, etc.)</li>
        <li>Responsive layout</li>
      </ul>
    </div>
  ),
};

/**
 * ## Building Chat Input
 *
 * Chat input component with send functionality and file upload.
 *
 * ### Basic Input Example
 *
 * ```tsx
 * import { useState } from 'react';
 * import { Button } from '@iblai/iblai-js';
 *
 * interface ChatInputProps {
 *   onSend: (content: string) => void;
 *   isStreaming: boolean;
 *   onStop: () => void;
 * }
 *
 * export function ChatInput({ onSend, isStreaming, onStop }: ChatInputProps) {
 *   const [input, setInput] = useState('');
 *
 *   const handleSubmit = (e: React.FormEvent) => {
 *     e.preventDefault();
 *     if (!input.trim()) return;
 *     onSend(input);
 *     setInput('');
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit} style={{ padding: '16px', borderTop: '1px solid #ddd' }}>
 *       <div style={{ display: 'flex', gap: '8px' }}>
 *         <textarea
 *           value={input}
 *           onChange={(e) => setInput(e.target.value)}
 *           placeholder="Type your message..."
 *           style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
 *           rows={1}
 *         />
 *
 *         {isStreaming ? (
 *           <Button type="button" onClick={onStop} variant="destructive">
 *             Stop
 *           </Button>
 *         ) : (
 *           <Button type="submit" disabled={!input.trim()}>
 *             Send
 *           </Button>
 *         )}
 *       </div>
 *     </form>
 *   );
 * }
 * ```
 *
 * ### With File Upload
 *
 * ```tsx
 * import { useState, useRef } from 'react';
 * import { Button } from '@iblai/iblai-js';
 *
 * export function ChatInputWithFiles({ onSend, isStreaming, onStop }) {
 *   const [input, setInput] = useState('');
 *   const [files, setFiles] = useState<File[]>([]);
 *   const fileInputRef = useRef<HTMLInputElement>(null);
 *
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     if (!input.trim() && files.length === 0) return;
 *
 *     // Upload files first, then send message with file URLs
 *     const fileAttachments = await uploadFiles(files);
 *     onSend(input, fileAttachments);
 *
 *     setInput('');
 *     setFiles([]);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {files.length > 0 && (
 *         <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
 *           {files.map((file, idx) => (
 *             <div key={idx} style={{ padding: '4px 8px', background: '#f0f0f0' }}>
 *               {file.name}
 *             </div>
 *           ))}
 *         </div>
 *       )}
 *
 *       <div style={{ display: 'flex', gap: '8px' }}>
 *         <input
 *           type="file"
 *           ref={fileInputRef}
 *           style={{ display: 'none' }}
 *           onChange={(e) => setFiles(Array.from(e.target.files || []))}
 *           multiple
 *         />
 *
 *         <Button
 *           type="button"
 *           variant="ghost"
 *           onClick={() => fileInputRef.current?.click()}
 *         >
 *           Attach
 *         </Button>
 *
 *         <textarea value={input} onChange={(e) => setInput(e.target.value)} />
 *
 *         <Button type="submit">Send</Button>
 *       </div>
 *     </form>
 *   );
 * }
 * ```
 */
export const ChatInputExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Chat Input Component</h3>

      <h4>Basic Input</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { useState } from 'react';
import { Button } from '@iblai/iblai-js';

function ChatInput({ onSend, isStreaming, onStop }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      {isStreaming ? (
        <Button onClick={onStop}>Stop</Button>
      ) : (
        <Button type="submit">Send</Button>
      )}
    </form>
  );
}`}
      </pre>

      <p><strong>Input Features:</strong></p>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Auto-expanding textarea</li>
        <li>File attachment support</li>
        <li>Send button (disabled when empty)</li>
        <li>Stop button (when AI is responding)</li>
        <li>Keyboard shortcuts (Enter to send)</li>
        <li>File preview before sending</li>
      </ul>
    </div>
  ),
};

/**
 * ## Complete Chat Interface
 *
 * Full example combining all components into a working chat application.
 *
 * See the code example in the story below for implementation details.
 */
export const CompleteExample: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Complete Chat Interface</h3>

      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { useAdvancedChat } from '@iblai/iblai-js';

function ChatApp() {
  const chat = useAdvancedChat({
    mentorId: 'mentor-123',
    mode: 'advanced',
    tenantKey: 'my-org',
    username: 'user@example.com',
    token: 'auth-token',
    wsUrl: 'wss://api.iblai.app/ws/langflow/',
    stopGenerationWsUrl: 'wss://api.iblai.app/ws/langflow-stop-generation/',
    redirectToAuthSpa: (redirectTo) => {
      window.location.href = \`/login?redirect=\${redirectTo}\`;
    },
  });

  return (
    <div style=${{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style=${{ flex: 1, overflow: 'auto' }}>
        {chat.messages.map((msg, i) =>
          msg.role === 'user'
            ? <UserMessage key={i} content={msg.content} />
            : <AIMessage key={i} content={msg.content} mentorName={chat.mentorName} />
        )}
      </div>

      <ChatInput
        onSend={(content) => chat.sendMessage('chat', content, { visible: true })}
        isStreaming={chat.isStreaming}
        onStop={chat.stopGenerating}
      />
    </div>
  );
}`}
      </pre>

      <h4>Implementation Checklist</h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li>✅ Install @iblai/iblai-js package</li>
        <li>✅ Set up Redux store with data-layer API</li>
        <li>✅ Configure WebSocket URLs</li>
        <li>✅ Implement authentication flow</li>
        <li>✅ Build message components (AI and user)</li>
        <li>✅ Build input component with file upload</li>
        <li>✅ Add loading indicators</li>
        <li>✅ Handle error states</li>
        <li>✅ Add accessibility features</li>
      </ul>
    </div>
  ),
};

/**
 * ## Additional Features
 *
 * Advanced features you can add to your chat interface.
 *
 * ### Message Actions
 * - Rating (thumbs up/down)
 * - Copy to clipboard
 * - Share conversation
 * - Retry generation
 * - Reply to specific message
 *
 * ### File Handling
 * - Drag & drop upload
 * - Image preview
 * - File type validation
 * - Upload progress
 * - Multiple file support
 *
 * ### AI Tools
 * - Web browsing
 * - Code interpreter
 * - Image generation
 * - Deep research
 * - Document analysis
 *
 * ### Communication
 * - Voice input (speech-to-text)
 * - Voice calls with AI
 * - Screen sharing
 * - Real-time streaming
 *
 * ### Accessibility
 * - Keyboard navigation
 * - Screen reader support (ARIA labels)
 * - Focus management
 * - High contrast mode
 */
export const AdditionalFeatures: Story = {
  render: () => (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
      <h3>Additional Chat Features</h3>

      <h4>Message Actions</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// Add action buttons to messages
function AIMessage({ content, onRate, onCopy, onRetry }) {
  return (
    <div>
      <Markdown content={content} />
      <div>
        <button onClick={() => onRate('up')}>👍</button>
        <button onClick={() => onRate('down')}>👎</button>
        <button onClick={onCopy}>Copy</button>
        <button onClick={onRetry}>Retry</button>
      </div>
    </div>
  );
}`}
      </pre>

      <h4>File Upload with Progress</h4>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// Track upload progress
const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    // Track progress
    onUploadProgress: (event) => {
      const progress = (event.loaded / event.total) * 100;
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: progress
      }));
    }
  });

  return response.json();
};`}
      </pre>

      <p><strong>Advanced Features:</strong></p>
      <ul style={{ lineHeight: '1.8' }}>
        <li>Message threading and replies</li>
        <li>Session history and search</li>
        <li>Export conversations</li>
        <li>Custom AI tools integration</li>
        <li>Multi-language support</li>
        <li>Dark mode support</li>
      </ul>
    </div>
  ),
};
