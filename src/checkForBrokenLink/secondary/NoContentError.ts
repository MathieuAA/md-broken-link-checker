export default class NoContentError extends Error {
  constructor(url: URL) {
    super(`No content found for URL "${url.toString()}"`);
    this.name = 'NoContentError';
  }
}
