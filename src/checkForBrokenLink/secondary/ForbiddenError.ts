export default class ForbiddenError extends Error {
  constructor(url: URL) {
    super(`Forbidden access for URL "${url.toString()}".`);
    this.name = 'ForbiddenError';
  }
}
