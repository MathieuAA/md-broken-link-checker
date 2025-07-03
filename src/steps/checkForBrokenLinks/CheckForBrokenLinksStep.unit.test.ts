import { describe, expect, it, beforeAll } from 'vitest';
import Link from '../../domain/links/Link';
import CheckForBrokenLinksStep from './CheckForBrokenLinksStep';
import HTTPLinkAdapter from './secondary/HTTPLinkAdapter';
import CheckedLink from '../../domain/checkedLinks/CheckedLink';
import { BrokenCheckResult, CheckResultStatus } from '../../domain/checkedLinks/CheckResult';
import {
  ForbiddenAccessError,
  NoContentError,
  NotFoundError,
  UnauthorizedAccessError,
  UnknownError,
} from '../../shared/http/HttpErrors';
import FakeHttpService from '../../shared/http/FakeHttpService';
import BrokenLinkError from '../../domain/links/BrokenLinkError';

describe('CheckForBrokenLinkStep - unit test', () => {
  describe('when the link are valid and working', () => {
    let checkedLinks: CheckedLink[];

    beforeAll(async () => {
      const httpService = new FakeHttpService({ head: { success: { status: 200 } } });
      const linkAdapter = new HTTPLinkAdapter(httpService);
      const step = new CheckForBrokenLinksStep(linkAdapter);
      checkedLinks = await step.execute([
        new Link('Test link 1', 'https://httpstat.us/200'),
        new Link('Test link 2', 'https://httpstat.us/200'),
      ]);
    });

    it('should return a list of okay links', async () => {
      checkedLinks.map((checkedLink) => {
        expect(checkedLink.result.getStatus()).to.equal(CheckResultStatus.OKAY);
      });
    });
  });

  describe('when a link is valid but there is no response (204)', () => {
    testErrorCase(new NoContentError(new URL('https://www.toto.com')), (result) => {
      expect(result.getError()).to.be.instanceOf(BrokenLinkError);
    });
  });

  describe('when a link is valid but an authorization is needed (401)', () => {
    testErrorCase(new UnauthorizedAccessError(new URL('https://www.toto.com')), (result: BrokenCheckResult) => {
      expect(result.getError()).to.be.instanceOf(BrokenLinkError);
    });
  });

  describe('when a link is valid but it is forbidden (403)', () => {
    testErrorCase(new ForbiddenAccessError(new URL('https://www.toto.com')), (result: BrokenCheckResult) => {
      expect(result.getError()).to.be.instanceOf(BrokenLinkError);
    });
  });

  describe('when the link is invalid', () => {
    describe('because the ressource does not exist (404)', () => {
      testErrorCase(new NotFoundError(new URL('https://www.toto.com')), (result: BrokenCheckResult) => {
        expect(result.getError()).to.be.instanceOf(BrokenLinkError);
      });
    });
  });

  describe('when an unknown error appears', () => {
    testErrorCase(new UnknownError(new URL('https://www.toto.com')), (result: BrokenCheckResult) => {
      expect(result.getError()).to.be.instanceOf(BrokenLinkError);
    });
  });
});

function testErrorCase(error: Error, customAssertion: (result: BrokenCheckResult) => void) {
  let checkedLinks: CheckedLink[];

  beforeAll(async () => {
    const httpService = new FakeHttpService({ head: { error } });
    const linkAdapter = new HTTPLinkAdapter(httpService);
    const step = new CheckForBrokenLinksStep(linkAdapter);
    checkedLinks = await step.execute([new Link('Test link', 'https://www.toto.com')]);
  });

  it('should return the list of mixed results', async () => {
    const result = checkedLinks[0].result as BrokenCheckResult;
    expect(result.getStatus()).to.equal(CheckResultStatus.BROKEN);
    customAssertion(result);
  });
}
