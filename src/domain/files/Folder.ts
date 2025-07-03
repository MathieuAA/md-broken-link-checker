import File from './File';

export default class Folder {
  private readonly files: File[];

  constructor(private readonly path: string) {
    this.files = [];
  }

  addFile(file: File): void {
    this.files.push(file);
  }

  forEachFile(callback: (file: File) => void): void {
    this.files.forEach(callback);
  }
}
