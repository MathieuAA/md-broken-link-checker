import { beforeAll, describe, expect, it } from 'vitest';
import File from '../../domain/files/File';
import Link from '../../domain/links/Link';
import CheckedLink from '../../domain/checkedLinks/CheckedLink';
import { CheckResultStatus } from '../../domain/checkedLinks/CheckResult';
import ReportBrokenLinksStep from './ReportBrokenLinksStep';

describe('ReportBrokenLinksStep - unit tests', () => {
  describe('when there are broken links and unbroken links', () => {
    let result: string;

    beforeAll(() => {
      const checkedLinks: CheckedLink[] = [
        new CheckedLink(new Link('Unbroken link 1', 'https://httpstat.us/200'), {
          getStatus: () => CheckResultStatus.OKAY,
        }),
        new CheckedLink(new Link('Unbroken link 2', 'https://httpstat.us/200'), {
          getStatus: () => CheckResultStatus.OKAY,
        }),
        new CheckedLink(new Link('Broken link 1', 'https://httpstat.us/204'), {
          getStatus: () => CheckResultStatus.BROKEN,
        }),
        new CheckedLink(new Link('Broken link 2', 'https://httpstat.us/401'), {
          getStatus: () => CheckResultStatus.BROKEN,
        }),
        new CheckedLink(new Link('Broken link 3', 'https://httpstat.us/404'), {
          getStatus: () => CheckResultStatus.BROKEN,
        }),
        new CheckedLink(new Link('Unbroken link 3', 'https://httpstat.us/200'), {
          getStatus: () => CheckResultStatus.OKAY,
        }),
      ];
      const step = new ReportBrokenLinksStep();
      result = step.execute([new File('a'), new File('b'), new File('c')], checkedLinks);
    });

    it('should summarize the results', () => {
      expect(result).to.equal(`Files checked: 3
Links checked: 6
Broken links found: 3

1. Broken link 1 (https://httpstat.us/204)
2. Broken link 2 (https://httpstat.us/401)
3. Broken link 3 (https://httpstat.us/404)
`);
    });
  });
});
