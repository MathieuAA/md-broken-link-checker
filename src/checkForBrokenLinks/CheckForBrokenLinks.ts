import LinkPort from '../domain/LinkPort';
import Link from '../domain/Link';

export default class CheckForBrokenLinkStep {
  constructor(private readonly linkPort: LinkPort) {}

  async execute(link: Link): Promise<void> {
    return this.linkPort.checkValid(link);
  }
}
