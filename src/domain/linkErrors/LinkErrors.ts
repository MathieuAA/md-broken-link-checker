import Link from '../links/Link';

type LinkError = ForbiddenAccessError | NoContentError | NotFoundError | UnauthorizedAccessError | UnknownError;

export default LinkError;

export class ForbiddenAccessError extends Error {
  constructor(link: Link) {
    super(`Forbidden access: "${link.getValue()}".`);
    this.name = 'ForbiddenError';
  }
}

export class NoContentError extends Error {
  constructor(link: Link) {
    super(`No content found for: "${link.getValue()}"`);
    this.name = 'NoContentError';
  }
}

export class NotFoundError extends Error {
  constructor(link: Link) {
    super(`Resource not found: ${link.getValue()}`);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedAccessError extends Error {
  constructor(link: Link) {
    super(`Unauthorized access: "${link.getValue()}".`);
    this.name = 'UnauthorizedAccessError';
  }
}

export class UnknownError extends Error {
  constructor(link: Link, additionalInfo: Record<string, unknown> = {}) {
    super(`Unknown error: "${link.getValue()}", additional info: "${JSON.stringify(additionalInfo)}"`);
    this.name = 'UnknownError';
  }
}
