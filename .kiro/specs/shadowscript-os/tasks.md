# Implementation Plan

- [x] 1. Initialize project and setup core infrastructure

  - Create Vite + React + TypeScript project with strict mode enabled
  - Configure tsconfig.json with strict type checking
  - Setup CSS Modules configuration in vite.config.ts
  - Create project directory structure (components, apps, services, types, utils, styles)
  - Install required dependencies (React 18+, TypeScript, Vite)
  - Create global CSS variables file with VGA color palette
  - Setup Perfect DOS VGA font or Courier New fallback
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2_

- [x] 2. Implement CRT display effects and visual foundation

  - [ ] 2.1 Create CRTDisplay component with props interface

    - Implement component structure with children wrapper
    - Add TypeScript interface for glitchIntensity, scanlineOpacity, phosphorColor props
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 2.2 Implement CSS-based CRT visual effects

    - Create scanline overlay using CSS pseudo-element with repeating-linear-gradient
    - Add phosphor glow effect using text-shadow

    - Implement screen curvature using CSS transform perspective
    - Add flicker animation with keyframes
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 2.3 Implement random glitch effect system

    - Create glitch animation keyframes with transform and opacity changes
    - Add interval-based trigger (5-15 seconds) using useEffect and setTimeout
    - Apply glitch class dynamically to CRTDisplay
    - _Requirements: 1.5_

- [x] 3. Build Terminal component and command system

  - [x] 3.1 Create Terminal component with input/output display

    - Implement TerminalLine interface (type, content, timestamp)

    - Create scrollable output area with auto-scroll to bottom
    - Add input field with blinking cursor animation
    - Implement command history array in state

    - _Requirements: 1.3, 9.4_

  - [x] 3.2 Implement command parser and routing

    - Create CommandParser utility with command registry
    - Implement command handlers for: help, ls, cd, cat, clear, ghostpaint, deadmail, haunt, mutate
    - Add command validation and error handling

    - Route commands to appropriate handlers
    - _Requirements: 2.2_

  - [x] 3.3 Add command history navigation

    - Implement up/down arrow key listeners

    - Store command history in state array
    - Navigate through history and populate input field
    - _Requirements: 2.2_

- [x] 4. Implement Ghost Agent with autonomous behavior



  - [x] 4.1 Create GhostAgent component structure

    - Implement GhostMessage interface (id, content, timestamp, isRewritten)
    - Create message display area with haunted styling
    - Add floating/fading idle animation using CSS keyframes

    - _Requirements: 2.1, 2.4_

  - [x] 4.2 Implement message generation system




    - Create messageTemplates.ts with categorized templates (mischievous, ominous, playful)
    - Implement random template selection function
    - Add context-aware response logic based on user commands

    - Maintain conversation history in state
    - _Requirements: 2.2, 2.4, 2.5_

  - [x] 4.3 Add autonomous message triggering




    - Implement interval-based random messages (30-120 seconds) using useEffect

    - Create greeting message on component mount with 2-second delay
    - Add personality shifting logic based on interactions
    - _Requirements: 2.1, 2.3_

- [x] 5. Create MCP VirtualFileSystem service





  - [x] 5.1 Implement VirtualFileSystem class with CRUD operations

    - Create FileNode and DirectoryNode interfaces
    - Implement createFile, readFile, updateFile, deleteFile methods
    - Add listDirectory and exists methods
    - Implement path normalization and validation utilities

    - _Requirements: 6.1, 6.3_

  - [x] 5.2 Add LocalStorage persistence layer



    - Implement serialization/deserialization for filesystem tree

    - Add automatic save on filesystem changes
    - Implement load on initialization
    - Add error handling for storage failures

    - _Requirements: 6.4_

  - [x] 5.3 Implement storage limit enforcement


    - Add size calculation for filesystem tree
    - Enforce 10MB maximum storage limit
    - Throw error when limit exceeded
    - Add cleanup suggestions in error message

    - _Requirements: 6.5_

  - [x] 5.4 Optimize operation performance


    - Add caching for frequently accessed files
    - Implement debounced persistence to reduce I/O
    - Ensure operations complete within 200ms target
    - _Requirements: 6.2_

- [x] 6. Create MCP MessageRewriter service










  - [x] 6.1 Implement MessageRewriter class with transformation methods


    - Create Transformation type union
    - Implement letterSubstitution transformation (o→0, i→1, e→3)
    - Implement wordReversal transformation
    - Implement spectralSymbols transformation (insert ░▒▓█)
    - Implement glitchText transformation (duplicate/corrupt characters)
    - Implement echoEffect transformation (repeat last word)
    - _Requirements: 7.2_
  - [x] 6.2 Add intensity-based transformation selection

    - Implement random intensity selection (subtle to extreme)
    - Apply multiple transformations based on intensity level
    - Ensure 80% minimum readability
    - _Requirements: 7.3, 7.5_

  - [x] 6.3 Optimize rewriting performance



    - Ensure transformations complete within 100ms
    - Add memoization for repeated messages
    - _Requirements: 7.4_

- [x] 7. Implement FileMutationHook service




  - [x] 7.1 Create FileMutationHook class with registration system


    - Implement registerFile and unregisterFile methods
    - Maintain Set of registered file paths
    - Add file creation event listener
    - _Requirements: 5.1_
  - [x] 7.2 Implement mutation algorithms

    - Create Mutation interface with type and apply method
    - Implement text corruption mutation (replace chars with symbols)
    - Implement character replacement mutation (swap similar-looking chars)
    - Implement content insertion mutation (add haunted messages)
    - Ensure mutations preserve file structure
    - _Requirements: 5.3, 5.4_
  - [x] 7.3 Add mutation trigger system

    - Implement triggerMutation method with 2-second completion target
    - Add random interval triggers (30-180 seconds)
    - Add command execution triggers
    - Add ghost interaction triggers
    - Log all mutations with timestamps
    - _Requirements: 5.2, 5.5_

- [x] 8. Build GhostPaint mini application






  - [x] 8.1 Create GhostPaint main component


    - Implement GhostPaintState interface
    - Create application window with retro chrome
    - Add component mounting/unmounting logic
    - _Requirements: 3.1, 9.5_
  - [x] 8.2 Implement PixelGrid component


    - Create 32x32 pixel grid using CSS Grid
    - Implement click handler to toggle pixel state
    - Store pixel data in 2D array
    - Add hover effects with haunted cursor trail
    - _Requirements: 3.1, 3.2_
  - [x] 8.3 Create ColorPalette component


    - Implement palette with 8 retro colors from VGA palette
    - Add color selection handler
    - Highlight selected color with haunted effect
    - _Requirements: 3.3, 3.4_
  - [x] 8.4 Add tool selection system


    - Implement pen, eraser, and fill tools
    - Create tool selector UI with ASCII borders
    - Apply haunted visual effects to selected tool
    - _Requirements: 3.4_
  - [x] 8.5 Implement save/load functionality


    - Add save button that writes to VirtualFileSystem
    - Implement artwork serialization to JSON
    - Add load functionality to restore saved artwork
    - _Requirements: 3.5_
  - [x] 8.6 Add random pixel corruption effect


    - Implement interval-based random pixel changes
    - Apply corruption sparingly to maintain usability
    - Add visual feedback for corruption events
    - _Requirements: 3.4_

- [x] 9. Build DeadMail mini application





  - [x] 9.1 Create DeadMail main component with view routing


    - Implement DeadMailState interface with inbox, compose, read views
    - Create view switching logic
    - Add retro window chrome
    - _Requirements: 4.1, 9.5_
  - [x] 9.2 Implement Inbox component


    - Create Email interface (id, from, to, subject, body, timestamp, isRead)
    - Display message list with unread indicators
    - Add message selection handler
    - Format timestamps in retro style (MM-DD-YYYY HH:MM)
    - _Requirements: 4.1, 4.5_
  - [x] 9.3 Create Compose component


    - Add input fields for recipient, subject, and body
    - Implement form validation
    - Add send button with haunted styling
    - _Requirements: 4.2_
  - [x] 9.4 Implement MessageReader component


    - Display selected email with full details
    - Apply flickering text animation to message body
    - Add distortion effects to text
    - Implement back to inbox navigation
    - _Requirements: 4.3_

  - [x] 9.5 Add message persistence

    - Save sent messages to VirtualFileSystem within 500ms
    - Load inbox messages from VirtualFileSystem on mount
    - Store messages as JSON files in /deadmail/ directory
    - _Requirements: 4.4_

- [x] 10. Implement application state management




  - [x] 10.1 Create AppContext and AppReducer


    - Define AppState interface with boot, terminal, ghost, apps, filesystem, effects
    - Implement reducer with actions for all state changes
    - Create Context provider component
    - _Requirements: 8.5_
  - [x] 10.2 Wire up state to all components


    - Connect Terminal to terminal state
    - Connect GhostAgent to ghost state
    - Connect mini-apps to apps state
    - Connect CRTDisplay to effects state
    - _Requirements: 8.5_

- [x] 11. Create boot sequence and app initialization




  - [x] 11.1 Implement boot sequence component


    - Create boot sequence steps array (BIOS check, loading message, ASCII logo)
    - Implement step-by-step display with delays
    - Add retro loading animations
    - _Requirements: 1.1_
  - [x] 11.2 Initialize filesystem with default structure


    - Create /home, /deadmail, /ghostpaint directories on first boot
    - Add welcome.txt file with instructions
    - Initialize empty inbox for DeadMail
    - _Requirements: 6.1, 6.3_
  - [x] 11.3 Trigger ghost agent greeting


    - Display greeting message after boot sequence completes
    - Set initial personality
    - _Requirements: 2.1_

- [x] 12. Add ErrorBoundary and error handling






  - [x] 12.1 Create ErrorBoundary component


    - Implement componentDidCatch lifecycle method
    - Display haunted error screen with recovery option
    - Log errors to console
    - _Requirements: 8.5_
  - [x] 12.2 Wrap mini-apps with ErrorBoundary


    - Add ErrorBoundary around GhostPaint
    - Add ErrorBoundary around DeadMail
    - Implement return to terminal on crash
    - _Requirements: 8.5_
  - [x] 12.3 Implement error handling for filesystem operations


    - Add try-catch blocks around all VirtualFileSystem operations
    - Display errors in terminal with haunted messages
    - Implement recovery strategies for common errors
    - _Requirements: 6.1_

- [x] 13. Polish UI and add retro styling details






  - [x] 13.1 Implement ASCII box-drawing borders


    - Add border characters (┌─┐│└┘) to all windows
    - Create reusable Window component with title bar
    - Style title bars with retro colors
    - _Requirements: 9.3, 9.5_
  - [x] 13.2 Add blinking cursor to all input fields


    - Create CSS animation for cursor blink
    - Apply to Terminal input
    - Apply to DeadMail compose fields
    - _Requirements: 9.4_
  - [x] 13.3 Fine-tune CRT effects


    - Adjust scanline opacity for optimal visibility
    - Tune phosphor glow intensity
    - Balance glitch frequency and intensity
    - Test across different screen sizes
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [x] 14. Integrate all systems and test end-to-end flows





  - [x] 14.1 Wire Ghost Agent to MessageRewriter


    - Pass ghost messages through MessageRewriter before display
    - Apply appropriate intensity based on personality
    - _Requirements: 2.4, 7.1_
  - [x] 14.2 Connect FileMutationHook to VirtualFileSystem


    - Register files automatically on creation
    - Apply mutations to file contents via VirtualFileSystem
    - Trigger mutations from ghost agent interactions
    - _Requirements: 5.1, 5.2_
  - [x] 14.3 Test command execution flows



    - Verify all terminal commands work correctly
    - Test app launching from terminal
    - Test file operations (ls, cd, cat)
    - Verify ghost agent responds to commands
    - _Requirements: 2.2, 6.1_
  - [x] 14.4 Test mini-app integration












    - Launch GhostPaint from terminal and verify save/load
    - Launch DeadMail from terminal and verify message persistence
    - Test returning to terminal from apps
    - _Requirements: 3.5, 4.4_
