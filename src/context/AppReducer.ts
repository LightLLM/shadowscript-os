import { AppState, TerminalLine, GhostMessage, AppType, GhostPaintState, DeadMailState, DirectoryNode } from '../types/app.types';

// Action types
export type AppAction =
  | { type: 'SET_BOOTED'; payload: boolean }
  | { type: 'SET_BOOT_STEP'; payload: number }
  | { type: 'ADD_TERMINAL_LINE'; payload: TerminalLine }
  | { type: 'ADD_TERMINAL_LINES'; payload: TerminalLine[] }
  | { type: 'CLEAR_TERMINAL' }
  | { type: 'SET_TERMINAL_INPUT'; payload: string }
  | { type: 'SET_CURSOR_POSITION'; payload: number }
  | { type: 'ADD_GHOST_MESSAGE'; payload: GhostMessage }
  | { type: 'SET_GHOST_PERSONALITY'; payload: 'mischievous' | 'ominous' | 'playful' }
  | { type: 'UPDATE_LAST_INTERACTION'; payload: number }
  | { type: 'SET_CURRENT_APP'; payload: AppType | null }
  | { type: 'SET_GHOSTPAINT_STATE'; payload: GhostPaintState | null }
  | { type: 'SET_DEADMAIL_STATE'; payload: DeadMailState | null }
  | { type: 'SET_FILESYSTEM_ROOT'; payload: DirectoryNode }
  | { type: 'SET_CURRENT_PATH'; payload: string }
  | { type: 'SET_GLITCH_ACTIVE'; payload: boolean }
  | { type: 'SET_GLITCH_INTENSITY'; payload: number }
  | { type: 'SET_SCANLINE_OPACITY'; payload: number }
  | { type: 'SET_PHOSPHOR_COLOR'; payload: 'green' | 'amber' };

// Initial state
export const initialState: AppState = {
  boot: {
    isBooted: false,
    bootSequence: [
      '╔═══════════════════════════════════════════╗',
      '║      SHADOWSCRIPT OS v1.0.0              ║',
      '║      A Haunted Computing Experience       ║',
      '╚═══════════════════════════════════════════╝',
      '',
      'Type "help" for available commands...',
      ''
    ],
    currentStep: 0
  },
  terminal: {
    history: [],
    currentInput: '',
    cursorPosition: 0
  },
  ghost: {
    messages: [],
    lastInteraction: Date.now(),
    personality: 'playful'
  },
  apps: {
    current: null,
    ghostpaint: null,
    deadmail: null
  },
  filesystem: {
    root: {
      name: '/',
      type: 'directory',
      children: new Map(),
      created: Date.now(),
      modified: Date.now()
    },
    currentPath: '/'
  },
  effects: {
    glitchActive: false,
    glitchIntensity: 0.5,
    scanlineOpacity: 0.15,
    phosphorColor: 'green'
  }
};

// Reducer function
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_BOOTED':
      return {
        ...state,
        boot: {
          ...state.boot,
          isBooted: action.payload
        }
      };

    case 'SET_BOOT_STEP':
      return {
        ...state,
        boot: {
          ...state.boot,
          currentStep: action.payload
        }
      };

    case 'ADD_TERMINAL_LINE':
      return {
        ...state,
        terminal: {
          ...state.terminal,
          history: [...state.terminal.history, action.payload]
        }
      };

    case 'ADD_TERMINAL_LINES':
      return {
        ...state,
        terminal: {
          ...state.terminal,
          history: [...state.terminal.history, ...action.payload]
        }
      };

    case 'CLEAR_TERMINAL':
      return {
        ...state,
        terminal: {
          ...state.terminal,
          history: []
        }
      };

    case 'SET_TERMINAL_INPUT':
      return {
        ...state,
        terminal: {
          ...state.terminal,
          currentInput: action.payload
        }
      };

    case 'SET_CURSOR_POSITION':
      return {
        ...state,
        terminal: {
          ...state.terminal,
          cursorPosition: action.payload
        }
      };

    case 'ADD_GHOST_MESSAGE':
      return {
        ...state,
        ghost: {
          ...state.ghost,
          messages: [...state.ghost.messages, action.payload]
        }
      };

    case 'SET_GHOST_PERSONALITY':
      return {
        ...state,
        ghost: {
          ...state.ghost,
          personality: action.payload
        }
      };

    case 'UPDATE_LAST_INTERACTION':
      return {
        ...state,
        ghost: {
          ...state.ghost,
          lastInteraction: action.payload
        }
      };

    case 'SET_CURRENT_APP':
      return {
        ...state,
        apps: {
          ...state.apps,
          current: action.payload
        }
      };

    case 'SET_GHOSTPAINT_STATE':
      return {
        ...state,
        apps: {
          ...state.apps,
          ghostpaint: action.payload
        }
      };

    case 'SET_DEADMAIL_STATE':
      return {
        ...state,
        apps: {
          ...state.apps,
          deadmail: action.payload
        }
      };

    case 'SET_FILESYSTEM_ROOT':
      return {
        ...state,
        filesystem: {
          ...state.filesystem,
          root: action.payload
        }
      };

    case 'SET_CURRENT_PATH':
      return {
        ...state,
        filesystem: {
          ...state.filesystem,
          currentPath: action.payload
        }
      };

    case 'SET_GLITCH_ACTIVE':
      return {
        ...state,
        effects: {
          ...state.effects,
          glitchActive: action.payload
        }
      };

    case 'SET_GLITCH_INTENSITY':
      return {
        ...state,
        effects: {
          ...state.effects,
          glitchIntensity: action.payload
        }
      };

    case 'SET_SCANLINE_OPACITY':
      return {
        ...state,
        effects: {
          ...state.effects,
          scanlineOpacity: action.payload
        }
      };

    case 'SET_PHOSPHOR_COLOR':
      return {
        ...state,
        effects: {
          ...state.effects,
          phosphorColor: action.payload
        }
      };

    default:
      return state;
  }
}
