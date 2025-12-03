export type AppType = 'terminal' | 'ghostpaint' | 'deadmail';

export interface AppState {
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
    personality: 'mischievous' | 'ominous' | 'playful';
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
    phosphorColor: 'green' | 'amber';
  };
}

export interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'ghost';
  content: string;
  timestamp: number;
}

export interface GhostMessage {
  id: string;
  content: string;
  timestamp: number;
  isRewritten: boolean;
}

export interface GhostPaintState {
  canvas: PixelGrid;
  selectedColor: string;
  selectedTool: 'pen' | 'eraser' | 'fill';
  palette: string[];
}

export interface PixelGrid {
  width: number;
  height: number;
  pixels: string[][];
}

export interface DeadMailState {
  inbox: Email[];
  currentView: 'inbox' | 'compose' | 'read';
  selectedEmail: Email | null;
}

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: number;
  isRead: boolean;
}

export interface DirectoryNode {
  name: string;
  type: 'directory';
  children: Map<string, FileNode | DirectoryNode>;
  created: number;
  modified: number;
}

export interface FileNode {
  name: string;
  type: 'file';
  content: string;
  size: number;
  created: number;
  modified: number;
  mimeType: string;
}

export enum ErrorType {
  FILESYSTEM_ERROR = 'FILESYSTEM_ERROR',
  STORAGE_LIMIT_EXCEEDED = 'STORAGE_LIMIT_EXCEEDED',
  INVALID_COMMAND = 'INVALID_COMMAND',
  APP_CRASH = 'APP_CRASH',
  MCP_SERVICE_ERROR = 'MCP_SERVICE_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  timestamp: number;
  recoverable: boolean;
}
