import { beforeAll, describe, expect, it } from 'vitest';
import File from '../../domain/files/File';
import Link from '../../domain/links/Link';
import CheckedLink from '../../domain/checkedLinks/CheckedLink';
import { BrokenCheckResult, OkayCheckResult } from '../../domain/checkedLinks/CheckResult';
import ReportBrokenLinksStep from './ReportBrokenLinksStep';
import BrokenLinkError from '../../domain/links/BrokenLinkError';

describe('ReportBrokenLinksStep - unit tests', () => {
  describe('when there are broken links and unbroken links', () => {
    let result: string;

    beforeAll(() => {
      const brokenLink1 = new Link('Broken link 1', 'https://httpbingo.org/status/204');
      const brokenLink2 = new Link('Broken link 2', 'https://httpbingo.org/status/401');
      const brokenLink3 = new Link('Broken link 3', 'https://httpbingo.org/status/404');
      const checkedLinks: CheckedLink[] = [
        new CheckedLink(new Link('Unbroken link 1', 'https://httpbingo.org/status/200'), new OkayCheckResult()),
        new CheckedLink(new Link('Unbroken link 2', 'https://httpbingo.org/status/200'), new OkayCheckResult()),
        new CheckedLink(brokenLink1, new BrokenCheckResult(new BrokenLinkError(brokenLink1, new Error()))),
        new CheckedLink(brokenLink2, new BrokenCheckResult(new BrokenLinkError(brokenLink2, new Error()))),
        new CheckedLink(brokenLink3, new BrokenCheckResult(new BrokenLinkError(brokenLink3, new Error()))),
        new CheckedLink(new Link('Unbroken link 2', 'https://httpbingo.org/status/200'), new OkayCheckResult()),
      ];
      const step = new ReportBrokenLinksStep();
      result = step.execute([new File('a'), new File('b'), new File('c')], checkedLinks);
    });

    it('should summarize the results', () => {
      expect(result).to.equal(`Files checked: 3
Links checked: 6
Broken links found: 3

1. Broken link 1 (https://httpbingo.org/status/204)
2. Broken link 2 (https://httpbingo.org/status/401)
3. Broken link 3 (https://httpbingo.org/status/404)
`);
    });
  });

  describe('when there are no broken links', () => {
    let result: string;

    beforeAll(() => {
      const checkedLinks: CheckedLink[] = [
        new CheckedLink(new Link('Unbroken link 1', 'https://httpstat.us/200'), new OkayCheckResult()),
        new CheckedLink(new Link('Unbroken link 2', 'https://httpstat.us/200'), new OkayCheckResult()),
        new CheckedLink(new Link('Unbroken link 3', 'https://httpstat.us/200'), new OkayCheckResult()),
      ];
      const step = new ReportBrokenLinksStep();
      result = step.execute([new File('a'), new File('b'), new File('c')], checkedLinks);
    });

    it('should report it', () => {
      expect(result).to.equal(`Files checked: 3
Links checked: 3
Broken links found: 0
`);
    });
  });
});
