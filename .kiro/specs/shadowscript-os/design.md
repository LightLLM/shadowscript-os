# ShadowScript OS - Design Document

## Overview

ShadowScript OS is a React-based single-page application that simulates a haunted retro operating system. The architecture follows a component-based design with a central state management system, modular mini-applications, and MCP integration for filesystem and message processing. The visual layer applies CRT effects, scanlines, and glitch animations to create an authentic haunted retro computing experience.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     App Container                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │            CRT Display Wrapper                     │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │         Terminal Shell                       │  │  │
│  │  │  ┌────────────┐  ┌────────────────────────┐ │  │  │
│  │  │  │ Ghost Agent│  │   Application Window   │ │  │  │
│  │  │  └────────────┘  │  - GhostPaint          │ │  │  │
│  │  │                  │  - DeadMail            │ │  │  │
│  │  │                  └────────────────────────┘ │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ State Manager│    │ MCP Services │    │ Effect System│
│  - App State │    │  - VirtualFS │    │  - CRT       │
│  - Messages  │    │  - Rewriter  │    │  - Glitch    │
│  - Files     │    │              │    │  - Scanlines │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Technology Stack

- **Framework**: React 18+ with functional components and hooks
- **Build Tool**: Vite with TypeScript configuration
- **Language**: TypeScript (strict mode)
- **Styling**: CSS Modules with CSS custom properties for theming
- **State Management**: React Context API with useReducer for complex state
- **Storage**: LocalStorage for filesystem persistence

## Components and Interfaces

### Core Components

#### 1. App Component

**Path**: `src/App.tsx`

Main application container that initializes the OS and manages global state.

```typescript
interface AppState {
  isBooted: boolean;
  currentApp: "terminal" | "ghostpaint" | "deadmail" | null;
  ghostMessages: GhostMessage[];
  filesystem: VirtualFileSystem;
}
```

#### 2. CRTDisplay Component

**Path**: `src/components/CRTDisplay/CRTDisplay.tsx`

Wrapper component that applies CRT visual effects to all children.

```typescript
interface CRTDisplayProps {
  children: React.ReactNode;
  glitchIntensity?: number; // 0-1
  scanlineOpacity?: number; // 0-1
  phosphorColor?: "green" | "amber" | "white";
}
```

**Features**:

- CSS-based scanline overlay
- Phosphor glow using text-shadow
- Screen curvature via CSS transform
- Random glitch animations using keyframes
- Flicker effect on text

#### 3. Terminal Component

**Path**: `src/components/Terminal/Terminal.tsx`

Main terminal interface for command input and output display.

```typescript
interface TerminalProps {
  onCommand: (command: string) => void;
  history: TerminalLine[];
}

interface TerminalLine {
  type: "input" | "output" | "error" | "ghost";
  content: string;
  timestamp: number;
}
```

**Features**:

- Command history with up/down arrow navigation
- Blinking cursor animation
- Auto-scroll to bottom on new output
- Command parsing and routing

#### 4. GhostAgent Component

**Path**: `src/components/GhostAgent/GhostAgent.tsx`

Autonomous agent that displays haunted messages and interacts with users.

```typescript
interface GhostAgentProps {
  onMessage: (message: string) => void;
  triggerInterval?: [number, number]; // min/max seconds
}

interface GhostMessage {
  id: string;
  content: string;
  timestamp: number;
  isRewritten: boolean;
}
```

**Behavior**:

- Random message generation using predefined templates
- Context-aware responses to user commands
- Idle animation (floating, fading)
- Message queue system

### Mini Applications

#### 5. GhostPaint Component

**Path**: `src/apps/GhostPaint/GhostPaint.tsx`

Pixel art editor with haunted effects.

```typescript
interface GhostPaintState {
  canvas: PixelGrid;
  selectedColor: string;
  selectedTool: "pen" | "eraser" | "fill";
  palette: string[];
}

interface PixelGrid {
  width: number;
  height: number;
  pixels: string[][]; // 2D array of color values
}
```

**Features**:

- Click-to-draw pixel grid
- Color palette selector
- Tool selector (pen, eraser, fill)
- Save/load functionality via VirtualFS
- Haunted cursor trail effect
- Random pixel corruption effect

#### 6. DeadMail Component

**Path**: `src/apps/DeadMail/DeadMail.tsx`

Email client with haunted message display.

```typescript
interface DeadMailState {
  inbox: Email[];
  currentView: "inbox" | "compose" | "read";
  selectedEmail: Email | null;
}

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: number;
  isRead: boolean;
}
```

**Features**:

- Inbox list view with unread indicators
- Compose form with recipient, subject, body
- Message reader with haunted text effects
- Save messages to VirtualFS
- Flickering text animation on message display

### MCP Services

#### 7. VirtualFileSystem Service

**Path**: `src/services/mcp/VirtualFileSystem.ts`

MCP-based virtual filesystem for persistent storage.

```typescript
interface VirtualFileSystem {
  createFile(path: string, content: string): Promise<void>;
  readFile(path: string): Promise<string>;
  updateFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  listDirectory(path: string): Promise<FileEntry[]>;
  exists(path: string): Promise<boolean>;
}

interface FileEntry {
  name: string;
  path: string;
  type: "file" | "directory";
  size: number;
  modified: number;
}
```

**Implementation**:

- LocalStorage backend with JSON serialization
- Path normalization and validation
- Directory tree structure
- 10MB storage limit enforcement
- Automatic persistence on changes

#### 8. MessageRewriter Service

**Path**: `src/services/mcp/MessageRewriter.ts`

MCP service for applying haunted transformations to text.

```typescript
interface MessageRewriter {
  rewrite(message: string, intensity?: number): string;
}

type Transformation =
  | "letterSubstitution"
  | "wordReversal"
  | "spectralSymbols"
  | "glitchText"
  | "echoEffect";
```

**Transformations**:

- Letter substitution (o→0, i→1, e→3)
- Word reversal (random words reversed)
- Spectral symbols (insert ░▒▓█ characters)
- Glitch text (duplicate/corrupt characters)
- Echo effect (repeat last word)

#### 9. FileMutationHook Service

**Path**: `src/services/hooks/FileMutationHook.ts`

Automated file mutation system triggered by events.

```typescript
interface FileMutationHook {
  registerFile(path: string): void;
  unregisterFile(path: string): void;
  triggerMutation(path: string): Promise<void>;
}

interface Mutation {
  type: "corruption" | "replacement" | "insertion";
  apply(content: string): string;
}
```

**Mutation Types**:

- Text corruption: Replace random characters with symbols
- Character replacement: Swap letters with similar-looking characters
- Content insertion: Add haunted messages at random positions

**Triggers**:

- File creation event
- Random interval (30-180 seconds)
- User command execution
- Ghost agent interaction

## Data Models

### Application State

```typescript
interface AppState {
  boot: {
    isBooted: boolean;
    bootSequence: string[];
    currentStep: number;
  };
  terminal: {
    history: TerminalLine[];
    currentInput: string;
    cursorPosition: number;
  };
  ghost: {
    messages: GhostMessage[];
    lastInteraction: number;
    personality: "mischievous" | "ominous" | "playful";
  };
  apps: {
    current: AppType | null;
    ghostpaint: GhostPaintState | null;
    deadmail: DeadMailState | null;
  };
  filesystem: {
    root: DirectoryNode;
    currentPath: string;
  };
  effects: {
    glitchActive: boolean;
    glitchIntensity: number;
    scanlineOpacity: number;
    phosphorColor: "green" | "amber";
  };
}
```

### File System Structure

```typescript
interface DirectoryNode {
  name: string;
  type: "directory";
  children: Map<string, FileNode | DirectoryNode>;
  created: number;
  modified: number;
}

interface FileNode {
  name: string;
  type: "file";
  content: string;
  size: number;
  created: number;
  modified: number;
  mimeType: string;
}
```

## Error Handling

### Error Types

```typescript
enum ErrorType {
  FILESYSTEM_ERROR = "FILESYSTEM_ERROR",
  STORAGE_LIMIT_EXCEEDED = "STORAGE_LIMIT_EXCEEDED",
  INVALID_COMMAND = "INVALID_COMMAND",
  APP_CRASH = "APP_CRASH",
  MCP_SERVICE_ERROR = "MCP_SERVICE_ERROR",
}

interface AppError {
  type: ErrorType;
  message: string;
  timestamp: number;
  recoverable: boolean;
}
```

### Error Handling Strategy

1. **Filesystem Errors**: Display error in terminal with haunted message, attempt recovery
2. **Storage Limit**: Warn user, prevent new file creation, suggest cleanup
3. **Invalid Commands**: Show "command not found" with ghost agent hint
4. **App Crashes**: Catch with Error Boundary, return to terminal, log error
5. **MCP Service Errors**: Fallback to in-memory operations, notify user

### Error Boundary Component

```typescript
// src/components/ErrorBoundary/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
```

Wraps each mini-app to prevent full application crashes.

## Testing Strategy

### Unit Testing

**Framework**: Vitest with React Testing Library

**Coverage Areas**:

- Component rendering and props
- State management logic
- MCP service functions
- Mutation algorithms
- Message rewriting transformations

**Example Test Structure**:

```typescript
describe("MessageRewriter", () => {
  it("should apply letter substitution", () => {
    const rewriter = new MessageRewriter();
    const result = rewriter.rewrite("hello", 0.5);
    expect(result).toMatch(/h[e3]ll[o0]/);
  });
});
```

### Integration Testing

**Focus Areas**:

- Terminal command execution flow
- File operations through VirtualFS
- Ghost agent message generation and display
- App launching and state management

### Visual Testing

**Manual Testing Checklist**:

- CRT effects render correctly across browsers
- Scanlines are visible but not distracting
- Glitch effects trigger at appropriate intervals
- Text is readable with phosphor glow
- Animations are smooth (60fps target)

## Performance Considerations

### Optimization Strategies

1. **Component Memoization**: Use React.memo for expensive renders (CRT effects, pixel grid)
2. **Virtual Scrolling**: Implement for terminal history (>1000 lines)
3. **Debounced Effects**: Throttle glitch animations to prevent performance degradation
4. **Lazy Loading**: Code-split mini-apps to reduce initial bundle size
5. **LocalStorage Batching**: Batch filesystem writes to reduce I/O operations

### Performance Targets

- Initial load: < 2 seconds
- Command execution: < 100ms
- File operations: < 200ms
- Frame rate: 60fps for animations
- Bundle size: < 500KB (gzipped)

## Visual Design Specifications

### Color Palette (VGA-inspired)

```css
:root {
  --color-black: #000000;
  --color-blue: #0000aa;
  --color-green: #00aa00;
  --color-cyan: #00aaaa;
  --color-red: #aa0000;
  --color-magenta: #aa00aa;
  --color-brown: #aa5500;
  --color-light-gray: #aaaaaa;
  --color-dark-gray: #555555;
  --color-bright-blue: #5555ff;
  --color-bright-green: #55ff55;
  --color-bright-cyan: #55ffff;
  --color-bright-red: #ff5555;
  --color-bright-magenta: #ff55ff;
  --color-yellow: #ffff55;
  --color-white: #ffffff;

  /* Primary theme colors */
  --color-phosphor: var(--color-bright-green);
  --color-background: var(--color-black);
  --color-text: var(--color-phosphor);
}
```

### Typography

- **Font**: "Perfect DOS VGA 437" or fallback to "Courier New"
- **Size**: 16px base (1rem)
- **Line Height**: 1.2 (tight, DOS-style)
- **Letter Spacing**: 0 (monospace natural spacing)

### CRT Effects CSS

```css
.crt-display {
  position: relative;
  background: var(--color-background);
  overflow: hidden;

  /* Screen curvature */
  transform: perspective(1000px) rotateX(0.5deg);

  /* Phosphor glow */
  text-shadow: 0 0 5px var(--color-phosphor), 0 0 10px var(--color-phosphor);
}

.crt-display::before {
  /* Scanlines */
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
}

.crt-display::after {
  /* Flicker effect */
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.02);
  animation: flicker 0.15s infinite;
  pointer-events: none;
}

@keyframes flicker {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.95;
  }
}
```

## Project Structure

```
shadowscript-os/
├── public/
│   └── fonts/
│       └── perfect-dos-vga.woff2
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── CRTDisplay/
│   │   │   ├── CRTDisplay.tsx
│   │   │   └── CRTDisplay.module.css
│   │   ├── Terminal/
│   │   │   ├── Terminal.tsx
│   │   │   ├── Terminal.module.css
│   │   │   └── CommandParser.ts
│   │   ├── GhostAgent/
│   │   │   ├── GhostAgent.tsx
│   │   │   ├── GhostAgent.module.css
│   │   │   └── messageTemplates.ts
│   │   └── ErrorBoundary/
│   │       └── ErrorBoundary.tsx
│   ├── apps/
│   │   ├── GhostPaint/
│   │   │   ├── GhostPaint.tsx
│   │   │   ├── GhostPaint.module.css
│   │   │   ├── PixelGrid.tsx
│   │   │   └── ColorPalette.tsx
│   │   └── DeadMail/
│   │       ├── DeadMail.tsx
│   │       ├── DeadMail.module.css
│   │       ├── Inbox.tsx
│   │       ├── Compose.tsx
│   │       └── MessageReader.tsx
│   ├── services/
│   │   ├── mcp/
│   │   │   ├── VirtualFileSystem.ts
│   │   │   └── MessageRewriter.ts
│   │   └── hooks/
│   │       └── FileMutationHook.ts
│   ├── context/
│   │   ├── AppContext.tsx
│   │   └── AppReducer.ts
│   ├── types/
│   │   ├── app.types.ts
│   │   ├── filesystem.types.ts
│   │   └── ghost.types.ts
│   ├── utils/
│   │   ├── storage.ts
│   │   └── textEffects.ts
│   └── styles/
│       ├── global.css
│       └── variables.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Implementation Notes

### Boot Sequence

On application load, display a retro boot sequence:

1. BIOS-style memory check
2. "Loading ShadowScript OS..."
3. ASCII art logo
4. Ghost agent greeting
5. Terminal prompt appears

### Command System

Supported terminal commands:

- `help` - Display available commands
- `ls` - List files in current directory
- `cd <path>` - Change directory
- `cat <file>` - Display file contents
- `ghostpaint` - Launch GhostPaint app
- `deadmail` - Launch DeadMail app
- `clear` - Clear terminal
- `haunt` - Trigger ghost agent interaction
- `mutate <file>` - Manually trigger file mutation

### Ghost Agent Personality

Message templates categorized by personality:

- **Mischievous**: Playful, teasing messages
- **Ominous**: Dark, foreboding warnings
- **Playful**: Friendly, helpful hints

Personality shifts based on user interactions and random intervals.
