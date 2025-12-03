# ShadowScript OS 👻

> A haunted retro operating system experience built for the Kiroween hackathon

ShadowScript OS is an immersive web-based retro computing experience that combines authentic CRT aesthetics with supernatural elements. Built with React and TypeScript, it features a fully functional terminal, autonomous ghost agent, mini applications, and a virtual filesystem—all wrapped in a haunted DOS-era aesthetic.

![ShadowScript OS](https://img.shields.io/badge/status-haunted-purple?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge)

## ✨ Features

### 🖥️ Authentic CRT Terminal
- **Scanline effects** - Realistic CRT display simulation
- **Phosphor glow** - Green/amber monochrome text with authentic glow
- **Screen curvature** - Subtle perspective distortion
- **Random glitches** - Periodic visual distortions (5-15 second intervals)
- **Blinking cursor** - Classic terminal input experience

### 👻 Haunted Ghost Agent
- **Autonomous behavior** - Initiates conversations every 30-120 seconds
- **Context-aware responses** - Reacts to your commands and actions
- **Dynamic personality** - Shifts between mischievous, ominous, and playful
- **Message rewriting** - Applies haunted text transformations with 5 different effects
- **Conversation memory** - Maintains session history

### 🎨 GhostPaint - Pixel Art Editor
- **32x32 pixel grid** - Classic bitmap canvas
- **8-color VGA palette** - Authentic retro colors
- **Multiple tools** - Pen, eraser, and fill bucket
- **Save/Load** - Persist artwork to virtual filesystem
- **Haunted effects** - Random pixel corruption and cursor trails

### 📧 DeadMail - Haunted Email Client
- **Inbox management** - View and organize messages
- **Compose messages** - Send haunted emails
- **Flickering text** - Supernatural message display effects
- **Persistent storage** - Messages saved to virtual filesystem
- **Retro timestamps** - DOS-style date formatting

### 💾 MCP Virtual Filesystem
- **Full CRUD operations** - Create, read, update, delete files
- **Directory hierarchy** - Nested folder support
- **LocalStorage persistence** - Data survives page reloads
- **10MB storage limit** - Enforced quota management
- **Performance optimized** - Operations complete in <200ms

### 🔄 File Mutation System
- **Automatic triggers** - Random mutations every 30-180 seconds
- **Multiple mutation types** - Text corruption, character replacement, content insertion
- **Event-based** - Triggered by commands and ghost interactions
- **Structure preservation** - Maintains file integrity while adding haunted effects

### ⚡ Message Rewriter Service
- **5 transformation types** - Letter substitution, word reversal, spectral symbols, glitch text, echo effect
- **Intensity-based** - Subtle to extreme transformations
- **80% readability** - Maintains message comprehension
- **High performance** - <100ms transformation time with memoization
- **Smart caching** - 20x+ speedup on repeated messages

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/shadowscript-os.git
cd shadowscript-os

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to experience the haunted OS.

## 🎮 Usage

### Terminal Commands

Once the boot sequence completes, you can use these commands:

```bash
help          # Display available commands
ls            # List files in current directory
cd <path>     # Change directory
cat <file>    # Display file contents
clear         # Clear terminal screen
ghostpaint    # Launch GhostPaint pixel art editor
deadmail      # Launch DeadMail email client
haunt         # Trigger ghost agent interaction
mutate <file> # Manually trigger file mutation
```

### Keyboard Shortcuts

- **↑/↓ Arrow Keys** - Navigate command history
- **Enter** - Execute command
- **Escape** - Close mini applications (return to terminal)

## 🏗️ Architecture

### Component Structure

```
ShadowScript OS
├── CRTDisplay (Visual Effects Layer)
│   ├── Terminal (Command Interface)
│   │   ├── CommandParser
│   │   └── History Management
│   ├── GhostAgent (Autonomous Character)
│   │   ├── Message Templates
│   │   └── Personality System
│   └── Application Windows
│       ├── GhostPaint
│       │   ├── PixelGrid
│       │   ├── ColorPalette
│       │   └── ToolSelector
│       └── DeadMail
│           ├── Inbox
│           ├── Compose
│           └── MessageReader
└── Services Layer
    ├── VirtualFileSystem (MCP)
    ├── MessageRewriter (MCP)
    └── FileMutationHook
```

### State Management

Uses React Context API with useReducer for centralized state:

```typescript
AppState {
  boot: { isBooted, bootSequence, currentStep }
  terminal: { history, currentInput, cursorPosition }
  ghost: { messages, lastInteraction, personality }
  apps: { current, ghostpaint, deadmail }
  filesystem: { root, currentPath }
  effects: { glitchActive, glitchIntensity, scanlineOpacity }
}
```

## 📁 Project Structure

```
shadowscript-os/
├── src/
│   ├── components/          # Core UI components
│   │   ├── BootSequence/    # Startup animation
│   │   ├── CRTDisplay/      # Visual effects wrapper
│   │   ├── Terminal/        # Command interface
│   │   ├── GhostAgent/      # Autonomous agent
│   │   ├── Window/          # Application window chrome
│   │   └── ErrorBoundary/   # Error handling
│   ├── apps/                # Mini applications
│   │   ├── GhostPaint/      # Pixel art editor
│   │   └── DeadMail/        # Email client
│   ├── services/            # Backend services
│   │   ├── mcp/             # MCP integrations
│   │   │   ├── VirtualFileSystem.ts
│   │   │   └── MessageRewriter.ts
│   │   └── hooks/           # Event hooks
│   │       └── FileMutationHook.ts
│   ├── context/             # State management
│   │   ├── AppContext.tsx
│   │   └── AppReducer.ts
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Helper functions
│   └── styles/              # Global CSS
├── .kiro/specs/             # Feature specifications
│   └── shadowscript-os/
│       ├── requirements.md  # EARS requirements
│       ├── design.md        # Architecture & design
│       └── tasks.md         # Implementation plan
└── public/                  # Static assets
```

## 🎨 Visual Design

### Color Palette (VGA-inspired)

The system uses an authentic 16-color VGA palette:

- **Primary**: Bright Green (#55ff55) - Phosphor text
- **Background**: Black (#000000)
- **Accent Colors**: Cyan, Magenta, Yellow, Red, Blue
- **Grayscale**: 4 shades from dark to bright

### Typography

- **Font**: Perfect DOS VGA 437 (fallback: Courier New)
- **Size**: 16px base (1rem)
- **Line Height**: 1.2 (tight, DOS-style)
- **Effects**: Phosphor glow, scanlines, flicker

### CRT Effects

All effects are CSS-based for optimal performance:
- Scanlines via repeating-linear-gradient
- Phosphor glow via text-shadow
- Screen curvature via CSS transform
- Glitch animations via keyframes

## 🧪 Testing

### Performance Tests

```bash
# Run MessageRewriter performance tests
npx tsx test-message-rewriter-performance.ts
```

Performance targets:
- File operations: <200ms
- Message transformations: <100ms
- Command execution: <100ms
- Frame rate: 60fps for animations

## 🛠️ Development

### Tech Stack

- **Framework**: React 18+ with functional components and hooks
- **Build Tool**: Vite with hot module replacement
- **Language**: TypeScript (strict mode enabled)
- **Styling**: CSS Modules with CSS custom properties
- **State**: React Context API with useReducer
- **Storage**: LocalStorage for persistence

### Code Quality

- Strict TypeScript configuration
- Component-based architecture
- CSS Modules for style isolation
- Maximum 300 lines per component
- Comprehensive error handling

### Adding New Commands

1. Add command handler to `CommandParser.ts`
2. Register in command registry
3. Add help text
4. Update README

### Creating New Mini Apps

1. Create component in `src/apps/`
2. Add to AppState type
3. Register launch command
4. Add window chrome wrapper

## 🐛 Known Issues

- Performance may vary on older browsers
- LocalStorage quota varies by browser
- Some Unicode characters may not render correctly in all fonts

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for learning or inspiration.

## 🎃 Credits

Built for the Kiroween hackathon with love for retro computing and supernatural aesthetics.

**Special Thanks:**
- VGA color palette inspiration from DOS era
- CRT effect techniques from retro gaming community
- Perfect DOS VGA font

---

*"The machine remembers... and it's watching you."* 👻
