export default class File {
  constructor(private readonly path: string) {}

  getPath(): string {
    return this.path;
  }
}
