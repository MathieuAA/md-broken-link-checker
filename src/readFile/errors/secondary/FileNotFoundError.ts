export class FileNotFoundError extends Error {
  constructor(filePath: string) {
    super(`Couldn't file "${filePath}"`);
    this.name = 'FileNotFoundError';
  }
}
