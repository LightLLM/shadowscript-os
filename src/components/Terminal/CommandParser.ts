import { TerminalLine } from '../../types/app.types'

export type CommandHandler = (args: string[]) => TerminalLine[]

export interface CommandRegistry {
  [key: string]: {
    handler: CommandHandler;
    description: string;
  }
}

export class CommandParser {
  private registry: CommandRegistry = {}

  register(command: string, handler: CommandHandler, description: string) {
    this.registry[command] = { handler, description }
  }

  parse(input: string): { command: string; args: string[] } {
    const parts = input.trim().split(/\s+/)
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)
    return { command, args }
  }

  execute(input: string): TerminalLine[] {
    const { command, args } = this.parse(input)
    
    // Add input line
    const lines: TerminalLine[] = [{
      type: 'input',
      content: input,
      timestamp: Date.now()
    }]

    // Execute command
    if (this.registry[command]) {
      const result = this.registry[command].handler(args)
      lines.push(...result)
    } else {
      lines.push({
        type: 'error',
        content: `Command not found: ${command}. Type 'help' for available commands.`,
        timestamp: Date.now()
      })
    }

    return lines
  }

  getCommands(): CommandRegistry {
    return this.registry
  }
}

// Create default command parser with built-in commands
export function createDefaultParser(): CommandParser {
  const parser = new CommandParser()

  parser.register('help', () => {
    const commands = parser.getCommands()
    const lines: TerminalLine[] = [{
      type: 'output',
      content: 'Available commands:',
      timestamp: Date.now()
    }]
    
    Object.entries(commands).forEach(([cmd, { description }]) => {
      lines.push({
        type: 'output',
        content: `  ${cmd.padEnd(12)} - ${description}`,
        timestamp: Date.now()
      })
    })
    
    return lines
  }, 'Display available commands')

  parser.register('clear', () => {
    return [] // Special case: will be handled by terminal to clear history
  }, 'Clear terminal screen')

  parser.register('ls', () => {
    return [{
      type: 'output',
      content: 'welcome.txt',
      timestamp: Date.now()
    }]
  }, 'List files in current directory')

  parser.register('cat', (args) => {
    if (args.length === 0) {
      return [{
        type: 'error',
        content: 'Usage: cat <filename>',
        timestamp: Date.now()
      }]
    }
    
    if (args[0] === 'welcome.txt') {
      return [{
        type: 'output',
        content: 'Welcome to ShadowScript OS - A Haunted Computing Experience',
        timestamp: Date.now()
      }, {
        type: 'output',
        content: 'Type "help" to see available commands.',
        timestamp: Date.now()
      }]
    }
    
    return [{
      type: 'error',
      content: `File not found: ${args[0]}`,
      timestamp: Date.now()
    }]
  }, 'Display file contents')

  parser.register('cd', (args) => {
    if (args.length === 0) {
      return [{
        type: 'output',
        content: 'Current directory: /',
        timestamp: Date.now()
      }]
    }
    
    return [{
      type: 'output',
      content: `Changed directory to: ${args[0]}`,
      timestamp: Date.now()
    }]
  }, 'Change directory')

  parser.register('ghostpaint', () => {
    return [{
      type: 'output',
      content: 'Launching GhostPaint...',
      timestamp: Date.now()
    }]
  }, 'Launch GhostPaint pixel art editor')

  parser.register('deadmail', () => {
    return [{
      type: 'output',
      content: 'Launching DeadMail...',
      timestamp: Date.now()
    }]
  }, 'Launch DeadMail email client')

  parser.register('haunt', () => {
    return [{
      type: 'ghost',
      content: '👻 Boo! Did I scare you?',
      timestamp: Date.now()
    }]
  }, 'Trigger ghost agent interaction')

  parser.register('mutate', (args) => {
    if (args.length === 0) {
      return [{
        type: 'error',
        content: 'Usage: mutate <filename>',
        timestamp: Date.now()
      }]
    }
    
    return [{
      type: 'output',
      content: `Mutating file: ${args[0]}...`,
      timestamp: Date.now()
    }, {
      type: 'ghost',
      content: '👻 The file has been... altered...',
      timestamp: Date.now()
    }]
  }, 'Manually trigger file mutation')

  return parser
}
