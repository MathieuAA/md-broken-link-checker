export default class UnauthorizedAccessError extends Error {
  constructor(url: URL) {
    super(`Unauthorized access for URL "${url.toString()}".`);
    this.name = 'UnauthorizedAccessError';
  }
}
