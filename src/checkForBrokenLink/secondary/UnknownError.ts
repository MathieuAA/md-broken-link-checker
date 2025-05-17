export default class UnknownError extends Error {
  constructor(url: URL) {
    super(`Unknown error for URL "${url.toString()}"`);
    this.name = 'UnknownError';
  }
}
