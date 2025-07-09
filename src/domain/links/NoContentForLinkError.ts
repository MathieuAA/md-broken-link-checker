import Link from './Link';
import BrokenLinkError from './BrokenLinkError';

export default class NoContentForLinkError extends BrokenLinkError {
  constructor(link: Link) {
    super(link, new Error('No content found'));
    this.name = 'NoContentError';
  }
}
