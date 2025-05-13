export class WrongFileExtensionError extends Error {
  constructor(filePath: string, expectedExtension: string) {
    super(`File "${filePath}" must have extension "${expectedExtension}"`);
    this.name = 'WrongFileExtensionError';
  }
}
