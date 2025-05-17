export default class Link {
  constructor(
    private readonly title: string,
    private readonly value: string
  ) {}

  getTitle(): string {
    return this.title;
  }
  getValue(): URL {
    return new URL(this.value);
  }
}
