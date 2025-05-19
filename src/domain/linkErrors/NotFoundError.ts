import Link from '../Link';

export default class NotFoundError extends Error {
  constructor(link: Link) {
    super(`Resource not found: ${link.getValue()}`);
    this.name = 'NotFoundError';
  }
}
