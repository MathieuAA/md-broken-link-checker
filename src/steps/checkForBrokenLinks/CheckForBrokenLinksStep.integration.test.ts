import { describe, expect, it, beforeAll } from 'vitest';
import Link from '../../domain/links/Link';
import CheckForBrokenLinks from './CheckForBrokenLinks';
import HTTPLinkAdapter from './secondary/HTTPLinkAdapter';
import CheckedLink from '../../domain/checkedLinks/CheckedLink';
import { BrokenCheckResult, CheckResultStatus } from '../../domain/checkedLinks/CheckResult';
import LinkError, {
  ForbiddenAccessError,
  NoContentError,
  NotFoundError,
  UnauthorizedAccessError,
  UnknownError,
} from '../../domain/linkErrors/LinkErrors';

describe('CheckForBrokenLinkStep - integration test', () => {
  describe('when the link are valid and working', () => {
    let checkedLinks: CheckedLink[];

    beforeAll(async () => {
      const httpService = new HTTPLinkAdapter();
      const step = new CheckForBrokenLinks(httpService);
      checkedLinks = await step.execute([
        new Link('Test link 1', 'https://httpstat.us/200'),
        new Link('Test link 2', 'https://httpstat.us/200'),
      ]);
    });

    it('should return a list of okay links', async () => {
      checkedLinks.map((checkedLink, index) => {
        expect(checkedLink.result.getStatus()).to.equal(CheckResultStatus.OKAY);
      });
    });
  });

  describe('when a link is valid but there is no response (204)', () => {
    testMixedResultsCase(204, (result) => {
      expect(result.getError()).to.be.instanceOf(NoContentError);
    });
  });

  describe('when a link is valid but an authorization is needed (401)', () => {
    testMixedResultsCase(401, (result) => {
      expect(result.getError()).to.be.instanceOf(UnauthorizedAccessError);
    });
  });

  describe('when a link is valid but it is forbidden (403)', () => {
    testMixedResultsCase(403, (result) => {
      expect(result.getError()).to.be.instanceOf(ForbiddenAccessError);
    });
  });

  describe('when the link is invalid', () => {
    describe('because the ressource does not exist (404)', () => {
      testMixedResultsCase(404, (result) => {
        expect(result.getError()).to.be.instanceOf(NotFoundError);
      });
    });
  });

  describe('when an unknown error appears', () => {
    testMixedResultsCase(500, (result) => {
      expect(result.getError()).to.be.instanceOf(UnknownError);
    });
  });
});

function testMixedResultsCase(
  httpStatusCodeForSecondLink: number,
  customAssertion: (result: BrokenCheckResult) => void
) {
  let checkedLinks: CheckedLink[];

  beforeAll(async () => {
    const httpService = new HTTPLinkAdapter();
    const step = new CheckForBrokenLinks(httpService);
    checkedLinks = await step.execute([
      new Link('Test link 1', 'https://httpstat.us/200'),
      new Link('Test link 2', `https://httpstat.us/${httpStatusCodeForSecondLink}`),
    ]);
  });

  it('should return the list of mixed results', async () => {
    expect(checkedLinks[0].result.getStatus()).to.equal(CheckResultStatus.OKAY);
    const result = checkedLinks[1].result as BrokenCheckResult;
    expect(result.getStatus()).to.equal(CheckResultStatus.BROKEN);
    customAssertion(result);
  });
}
