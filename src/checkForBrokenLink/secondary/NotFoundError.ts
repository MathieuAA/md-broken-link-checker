export default class NotFoundError extends Error {
  constructor(resource: URL) {
    super(`Resource at "${resource}" not found`);
    this.name = 'NotFoundError';
  }
}
