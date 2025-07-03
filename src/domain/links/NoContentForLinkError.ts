import Link from './Link';

export default class NoContentForLinkError extends Error {
  constructor(link: Link) {
    super(`NoContent: "${link.getValue()}".`);
    this.name = 'NoContentError';
  }
}
