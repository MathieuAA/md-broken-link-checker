export class ForbiddenAccessError extends Error {
  constructor(url: URL) {
    super(`Forbidden access: "${url.toString()}".`);
    this.name = 'ForbiddenError';
  }
}

export class NoContentError extends Error {
  constructor(url: URL) {
    super(`No content found for: "${url.toString()}"`);
    this.name = 'NoContentError';
  }
}

export class NotFoundError extends Error {
  constructor(url: URL) {
    super(`Resource not found: ${url.toString()}`);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedAccessError extends Error {
  constructor(url: URL) {
    super(`Unauthorized access: "${url.toString()}".`);
    this.name = 'UnauthorizedAccessError';
  }
}

export class UnknownError extends Error {
  constructor(url: URL, additionalInfo: Record<string, unknown> = {}) {
    super(`Unknown error: "${url.toString()}", additional info: "${JSON.stringify(additionalInfo)}"`);
    this.name = 'UnknownError';
  }
}
