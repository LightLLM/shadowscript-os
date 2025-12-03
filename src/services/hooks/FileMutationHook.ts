import { FileMutationHookInterface, Mutation } from '../../types/ghost.types'
import { VirtualFileSystem } from '../mcp/VirtualFileSystem'

export class FileMutationHook implements FileMutationHookInterface {
  private registeredFiles: Set<string> = new Set()
  private mutationLog: Array<{ path: string; timestamp: number; type: string }> = []
  private fs: VirtualFileSystem
  private fileCreationListeners: Array<(path: string) => void> = []

  constructor(filesystem: VirtualFileSystem) {
    this.fs = filesystem
    this.setupFileCreationListener()
  }

  private setupFileCreationListener(): void {
    // Store original createFile method
    const originalCreateFile = this.fs.createFile.bind(this.fs)
    
    // Override createFile to emit events
    this.fs.createFile = async (path: string, content: string) => {
      await originalCreateFile(path, content)
      // Notify all listeners about file creation
      this.fileCreationListeners.forEach(listener => listener(path))
    }
  }

  onFileCreated(callback: (path: string) => void): void {
    this.fileCreationListeners.push(callback)
  }

  registerFile(path: string): void {
    this.registeredFiles.add(path)
  }

  unregisterFile(path: string): void {
    this.registeredFiles.delete(path)
  }

  async triggerMutation(path: string): Promise<void> {
    if (!this.registeredFiles.has(path)) {
      throw new Error('░▒▓ File not registered for haunting ▓▒░')
    }

    try {
      const content = await this.fs.readFile(path)
      const mutation = this.selectRandomMutation()
      const mutatedContent = mutation.apply(content)
      
      await this.fs.updateFile(path, mutatedContent)
      
      this.mutationLog.push({
        path,
        timestamp: Date.now(),
        type: mutation.type
      })
    } catch (error) {
      console.error(`░▒▓█ ERROR: Failed to haunt file ${path}:`, error)
      throw error // Re-throw to allow caller to handle
    }
  }

  private selectRandomMutation(): Mutation {
    const mutations: Mutation[] = [
      this.createCorruptionMutation(),
      this.createReplacementMutation(),
      this.createInsertionMutation()
    ]
    
    return mutations[Math.floor(Math.random() * mutations.length)]
  }

  private createCorruptionMutation(): Mutation {
    return {
      type: 'corruption',
      apply: (content: string) => {
        const chars = content.split('')
        const corruptCount = Math.floor(chars.length * 0.05) // Corrupt 5% of characters
        
        for (let i = 0; i < corruptCount; i++) {
          const pos = Math.floor(Math.random() * chars.length)
          const symbols = ['�', '�', '�', '�', '░', '▒', '▓', '█']
          chars[pos] = symbols[Math.floor(Math.random() * symbols.length)]
        }
        
        return chars.join('')
      }
    }
  }

  private createReplacementMutation(): Mutation {
    return {
      type: 'replacement',
      apply: (content: string) => {
        const replacements: { [key: string]: string } = {
          'a': '4',
          'e': '3',
          'i': '1',
          'o': '0',
          's': '5',
          't': '7',
          'A': '4',
          'E': '3',
          'I': '1',
          'O': '0',
          'S': '5',
          'T': '7'
        }
        
        return content.split('').map(char => {
          if (replacements[char] && Math.random() < 0.1) {
            return replacements[char]
          }
          return char
        }).join('')
      }
    }
  }

  private createInsertionMutation(): Mutation {
    return {
      type: 'insertion',
      apply: (content: string) => {
        const hauntedMessages = [
          '\n[CORRUPTED BY GHOST]\n',
          '\n...they are watching...\n',
          '\n👻\n',
          '\n[FILE HAUNTED]\n',
          '\n...the shadows grow...\n'
        ]
        
        const message = hauntedMessages[Math.floor(Math.random() * hauntedMessages.length)]
        const insertPos = Math.floor(Math.random() * content.length)
        
        return content.slice(0, insertPos) + message + content.slice(insertPos)
      }
    }
  }

  getMutationLog(): Array<{ path: string; timestamp: number; type: string }> {
    return [...this.mutationLog]
  }

  getRegisteredFiles(): string[] {
    return Array.from(this.registeredFiles)
  }

  startRandomMutations(minInterval: number = 30000, maxInterval: number = 180000): void {
    const triggerNext = () => {
      if (this.registeredFiles.size > 0) {
        const files = Array.from(this.registeredFiles)
        const randomFile = files[Math.floor(Math.random() * files.length)]
        this.triggerMutation(randomFile).catch(err => 
          console.error('░▒▓ Random mutation failed:', err)
        )
      }
      
      const nextDelay = minInterval + Math.random() * (maxInterval - minInterval)
      setTimeout(triggerNext, nextDelay)
    }
    
    const initialDelay = minInterval + Math.random() * (maxInterval - minInterval)
    setTimeout(triggerNext, initialDelay)
  }

  onCommandExecution(command: string): void {
    // Trigger mutation on command execution with 20% probability
    if (Math.random() < 0.2 && this.registeredFiles.size > 0) {
      const files = Array.from(this.registeredFiles)
      const randomFile = files[Math.floor(Math.random() * files.length)]
      this.triggerMutation(randomFile).catch(err => 
        console.error(`░▒▓ Command-triggered mutation failed:`, err)
      )
      
      console.log(`░▒▓ Command "${command}" triggered haunting on ${randomFile} ▓▒░`)
    }
  }

  onGhostInteraction(interactionType: string): void {
    // Trigger mutation on ghost interaction with 30% probability
    if (Math.random() < 0.3 && this.registeredFiles.size > 0) {
      const files = Array.from(this.registeredFiles)
      const randomFile = files[Math.floor(Math.random() * files.length)]
      this.triggerMutation(randomFile).catch(err => 
        console.error(`░▒▓ Ghost-triggered mutation failed:`, err)
      )
      
      console.log(`░▒▓ Ghost interaction "${interactionType}" triggered haunting on ${randomFile} ▓▒░`)
    }
  }
}
