import { VirtualFileSystem } from '../services/mcp/VirtualFileSystem'

const WELCOME_TEXT = `╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   Welcome to SHADOWSCRIPT OS                              ║
║                                                           ║
║   A haunted retro computing experience where the dead     ║
║   code comes alive...                                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

GETTING STARTED
===============

Available Commands:
  help       - Display this help message
  ls         - List files in current directory
  cd <path>  - Change directory
  cat <file> - Display file contents
  clear      - Clear the terminal screen
  
Applications:
  ghostpaint - Launch the GhostPaint pixel art editor
  deadmail   - Launch the DeadMail email client
  
Special Commands:
  haunt      - Summon the ghost agent
  mutate     - Trigger file mutations (use with caution!)

TIPS
====
- The ghost agent is always watching and may interact with you
- Files may mutate on their own... it's part of the experience
- Save your work frequently in GhostPaint and DeadMail
- Type 'help' anytime to see available commands

Enjoy your stay in the shadows...

👻 The Ghost Agent
`

/**
 * Initialize the virtual filesystem with default directories and files
 * This should be called on first boot or when the filesystem is empty
 */
export async function initializeFilesystem(fs: VirtualFileSystem): Promise<void> {
  try {
    // Check if filesystem is already initialized
    const homeExists = await fs.exists('/home')
    if (homeExists) {
      // Already initialized, skip
      return
    }

    // Create default directory structure
    await fs.createDirectory('/home')
    await fs.createDirectory('/deadmail')
    await fs.createDirectory('/ghostpaint')

    // Create welcome.txt in home directory
    await fs.createFile('/home/welcome.txt', WELCOME_TEXT)

    // Create a sample file in home
    await fs.createFile(
      '/home/about.txt',
      'SHADOWSCRIPT OS v1.0.0\n\nA haunted operating system built for Kiroween.\n\nBeware: Files may change on their own...\n'
    )

    // Initialize empty inbox for DeadMail
    // Create a placeholder file to indicate the directory is for mail
    await fs.createFile(
      '/deadmail/.inbox',
      '[]'
    )

    // Create a sample artwork directory indicator for GhostPaint
    await fs.createFile(
      '/ghostpaint/.artworks',
      '[]'
    )

    console.log('░▒▓ Filesystem summoned from the void ▓▒░')
  } catch (error) {
    console.error('░▒▓█ ERROR: Failed to initialize filesystem from the depths:', error)
    // Don't throw - allow the app to continue even if initialization fails
  }
}

/**
 * Check if this is the first boot (filesystem not initialized)
 */
export async function isFirstBoot(fs: VirtualFileSystem): Promise<boolean> {
  try {
    const homeExists = await fs.exists('/home')
    return !homeExists
  } catch (error) {
    console.error('░▒▓ Error checking first boot from the void:', error)
    return true // Assume first boot on error
  }
}
