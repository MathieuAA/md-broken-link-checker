export default class UnauthorizedError extends Error {
  constructor(url: URL) {
    super(`Unauthorized access for URL "${url.toString()}".`);
    this.name = 'UnauthorizedError';
  }
}
