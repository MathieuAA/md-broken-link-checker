import Link from '../Link';

export default class UnknownError extends Error {
  constructor(link: Link, additionalInfo: Record<string, unknown> = {}) {
    super(`Unknown error: "${link.getValue()}", additional info: "${JSON.stringify(additionalInfo)}"`);
    this.name = 'UnknownError';
  }
}
