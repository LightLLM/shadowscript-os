export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  modified: number;
}

export interface VirtualFileSystemInterface {
  createFile(path: string, content: string): Promise<void>;
  readFile(path: string): Promise<string>;
  updateFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  listDirectory(path: string): Promise<FileEntry[]>;
  exists(path: string): Promise<boolean>;
}
