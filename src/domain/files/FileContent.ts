export default class FileContent {
  constructor(private readonly value: string) {}

  getValue(): string {
    return this.value;
  }
}
