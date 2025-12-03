import { FileEntry, VirtualFileSystemInterface } from '../../types/filesystem.types'
import { DirectoryNode, FileNode } from '../../types/app.types'

export class VirtualFileSystem implements VirtualFileSystemInterface {
  private root: DirectoryNode
  private readonly STORAGE_KEY = 'shadowscript_fs'
  private readonly MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
  private fileCache: Map<string, { content: string; timestamp: number }> = new Map()
  private readonly CACHE_TTL = 5000 // 5 seconds
  private saveTimeout: number | null = null
  private readonly SAVE_DEBOUNCE_MS = 300

  constructor() {
    this.root = this.loadFromStorage() || this.createDefaultStructure()
  }

  private createDefaultStructure(): DirectoryNode {
    const now = Date.now()
    return {
      name: '/',
      type: 'directory',
      children: new Map(),
      created: now,
      modified: now
    }
  }

  private normalizePath(path: string): string[] {
    return path
      .split('/')
      .filter(p => p && p !== '.')
      .map(p => p.trim())
  }

  private getNode(path: string): FileNode | DirectoryNode | null {
    const parts = this.normalizePath(path)
    if (parts.length === 0) return this.root

    let current: FileNode | DirectoryNode = this.root
    
    for (const part of parts) {
      if (current.type !== 'directory') return null
      const next = current.children.get(part)
      if (!next) return null
      current = next
    }
    
    return current
  }

  private getParentNode(path: string): DirectoryNode | null {
    const parts = this.normalizePath(path)
    if (parts.length === 0) return null
    
    const parentPath = parts.slice(0, -1).join('/')
    const parent = this.getNode(parentPath || '/')
    
    return parent?.type === 'directory' ? parent : null
  }

  async createFile(path: string, content: string): Promise<void> {
    const parts = this.normalizePath(path)
    if (parts.length === 0) {
      throw new Error('Invalid file path')
    }

    const fileName = parts[parts.length - 1]
    const parent = this.getParentNode(path)
    
    if (!parent) {
      throw new Error('Parent directory does not exist')
    }

    if (parent.children.has(fileName)) {
      throw new Error('File already exists')
    }

    const now = Date.now()
    const file: FileNode = {
      name: fileName,
      type: 'file',
      content,
      size: content.length,
      created: now,
      modified: now,
      mimeType: 'text/plain'
    }

    parent.children.set(fileName, file)
    parent.modified = now
    
    await this.debouncedSave()
  }

  async readFile(path: string): Promise<string> {
    // Check cache first
    const cached = this.fileCache.get(path)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.content
    }

    const node = this.getNode(path)
    
    if (!node) {
      throw new Error('File not found')
    }
    
    if (node.type !== 'file') {
      throw new Error('Path is not a file')
    }
    
    // Update cache
    this.fileCache.set(path, {
      content: node.content,
      timestamp: Date.now()
    })
    
    return node.content
  }

  async updateFile(path: string, content: string): Promise<void> {
    const node = this.getNode(path)
    
    if (!node) {
      throw new Error('File not found')
    }
    
    if (node.type !== 'file') {
      throw new Error('Path is not a file')
    }
    
    node.content = content
    node.size = content.length
    node.modified = Date.now()
    
    // Invalidate cache for this file
    this.fileCache.delete(path)
    
    await this.debouncedSave()
  }

  async deleteFile(path: string): Promise<void> {
    const parts = this.normalizePath(path)
    if (parts.length === 0) {
      throw new Error('Cannot delete root directory')
    }

    const fileName = parts[parts.length - 1]
    const parent = this.getParentNode(path)
    
    if (!parent) {
      throw new Error('Parent directory does not exist')
    }

    if (!parent.children.has(fileName)) {
      throw new Error('File not found')
    }

    parent.children.delete(fileName)
    parent.modified = Date.now()
    
    // Invalidate cache for this file
    this.fileCache.delete(path)
    
    await this.debouncedSave()
  }

  async listDirectory(path: string): Promise<FileEntry[]> {
    const node = this.getNode(path)
    
    if (!node) {
      throw new Error('Directory not found')
    }
    
    if (node.type !== 'directory') {
      throw new Error('Path is not a directory')
    }
    
    const entries: FileEntry[] = []
    const basePath = path === '/' ? '' : path
    
    node.children.forEach((child, name) => {
      entries.push({
        name,
        path: `${basePath}/${name}`,
        type: child.type,
        size: child.type === 'file' ? child.size : 0,
        modified: child.modified
      })
    })
    
    return entries.sort((a, b) => a.name.localeCompare(b.name))
  }

  async exists(path: string): Promise<boolean> {
    return this.getNode(path) !== null
  }

  async createDirectory(path: string): Promise<void> {
    const parts = this.normalizePath(path)
    if (parts.length === 0) {
      throw new Error('Invalid directory path')
    }

    const dirName = parts[parts.length - 1]
    const parent = this.getParentNode(path)
    
    if (!parent) {
      throw new Error('Parent directory does not exist')
    }

    if (parent.children.has(dirName)) {
      throw new Error('Directory already exists')
    }

    const now = Date.now()
    const dir: DirectoryNode = {
      name: dirName,
      type: 'directory',
      children: new Map(),
      created: now,
      modified: now
    }

    parent.children.set(dirName, dir)
    parent.modified = now
    
    await this.debouncedSave()
  }

  private calculateSize(node: FileNode | DirectoryNode): number {
    if (node.type === 'file') {
      return node.size
    }
    
    let total = 0
    node.children.forEach(child => {
      total += this.calculateSize(child)
    })
    return total
  }

  private async debouncedSave(): Promise<void> {
    // Clear existing timeout
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout)
    }

    // Set new timeout
    return new Promise((resolve, reject) => {
      this.saveTimeout = window.setTimeout(async () => {
        try {
          await this.saveToStorage()
          resolve()
        } catch (error) {
          reject(error)
        }
      }, this.SAVE_DEBOUNCE_MS)
    })
  }

  private async saveToStorage(): Promise<void> {
    const size = this.calculateSize(this.root)
    
    if (size > this.MAX_SIZE_BYTES) {
      throw new Error(`Storage limit exceeded: ${(size / 1024 / 1024).toFixed(2)}MB / 10MB. Consider deleting unused files.`)
    }

    try {
      const serialized = this.serializeNode(this.root)
      const jsonString = JSON.stringify(serialized)
      localStorage.setItem(this.STORAGE_KEY, jsonString)
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Browser storage is full. Please clear some space.')
      }
      throw new Error(`Failed to save filesystem: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private loadFromStorage(): DirectoryNode | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) return null
      
      const parsed = JSON.parse(data)
      return this.deserializeNode(parsed) as DirectoryNode
    } catch (error) {
      console.error('Failed to load filesystem from storage:', error)
      // Return null to create a fresh filesystem
      return null
    }
  }

  private serializeNode(node: FileNode | DirectoryNode): any {
    if (node.type === 'file') {
      return {
        name: node.name,
        type: 'file',
        content: node.content,
        size: node.size,
        created: node.created,
        modified: node.modified,
        mimeType: node.mimeType
      }
    }
    
    const children: any = {}
    node.children.forEach((child, key) => {
      children[key] = this.serializeNode(child)
    })
    
    return {
      name: node.name,
      type: 'directory',
      children,
      created: node.created,
      modified: node.modified
    }
  }

  private deserializeNode(data: any): FileNode | DirectoryNode {
    if (data.type === 'file') {
      return {
        name: data.name,
        type: 'file',
        content: data.content,
        size: data.size,
        created: data.created,
        modified: data.modified,
        mimeType: data.mimeType
      }
    }
    
    const children = new Map<string, FileNode | DirectoryNode>()
    Object.entries(data.children || {}).forEach(([key, value]) => {
      children.set(key, this.deserializeNode(value))
    })
    
    return {
      name: data.name,
      type: 'directory',
      children,
      created: data.created,
      modified: data.modified
    }
  }

  getRoot(): DirectoryNode {
    return this.root
  }

  async flush(): Promise<void> {
    // Clear any pending debounced save
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout)
      this.saveTimeout = null
    }
    // Force immediate save
    await this.saveToStorage()
  }

  clearCache(): void {
    this.fileCache.clear()
  }
}
