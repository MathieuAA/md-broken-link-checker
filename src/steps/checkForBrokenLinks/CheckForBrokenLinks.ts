import LinkPort from '../../domain/links/LinkPort';
import Link from '../../domain/links/Link';
import CheckedLink from '../../domain/checkedLinks/CheckedLink';
import { OkayCheckResult, BrokenCheckResult } from '../../domain/checkedLinks/CheckResult';

export default class CheckForBrokenLinks {
  constructor(private readonly linkPort: LinkPort) {}

  async execute(links: Link[]): Promise<CheckedLink[]> {
    const results = await Promise.allSettled(links.map((link) => this.linkPort.checkValid(link)));
    return results.map((result, index) => {
      const link = links[index];
      const checkResult = result.status === 'fulfilled' ? new OkayCheckResult() : new BrokenCheckResult(result.reason);

      return {
        link,
        result: checkResult,
      };
    });
  }
}
