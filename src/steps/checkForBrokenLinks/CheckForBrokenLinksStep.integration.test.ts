import { describe, expect, it, beforeAll } from 'vitest';
import Link from '../../domain/links/Link';
import CheckForBrokenLinksStep from './CheckForBrokenLinksStep';
import HTTPLinkAdapter from './secondary/HTTPLinkAdapter';
import CheckedLink from '../../domain/checkedLinks/CheckedLink';
import AxiosHttpService from '../../shared/http/AxiosHttpService';
import BrokenLinkError from '../../domain/links/BrokenLinkError';

describe('CheckForBrokenLinkStep - integration test', () => {
  describe('when the link are valid and working', () => {
    let checkedLinks: CheckedLink[];

    beforeAll(async () => {
      const httpService = new AxiosHttpService();
      const linkAdapter = new HTTPLinkAdapter(httpService);
      const step = new CheckForBrokenLinksStep(linkAdapter);
      checkedLinks = await step.execute([
        new Link('Test link 1', 'https://httpbingo.org/status/200'),
        new Link('Test link 2', 'https://httpbingo.org/status/200'),
      ]);
    });

    it('should return a list of okay links', async () => {
      checkedLinks.forEach((checkedLink) => {
        expect(checkedLink.isBroken()).to.be.false;
      });
    });
  });

  describe('when a link is valid but there is no response (204)', () => {
    testMixedResultsCase(204, (error) => {
      expect(error).to.be.instanceOf(BrokenLinkError);
    });
  });

  describe('when a link is valid but an authorization is needed (401)', () => {
    testMixedResultsCase(401, (error) => {
      expect(error).to.be.instanceOf(BrokenLinkError);
    });
  });

  describe('when a link is valid but it is forbidden (403)', () => {
    testMixedResultsCase(403, (error) => {
      expect(error).to.be.instanceOf(BrokenLinkError);
    });
  });

  describe('when the link is invalid', () => {
    describe('because the ressource does not exist (404)', () => {
      testMixedResultsCase(404, (error) => {
        expect(error).to.be.instanceOf(BrokenLinkError);
      });
    });
  });

  describe('when an unknown error appears', () => {
    testMixedResultsCase(500, (error) => {
      expect(error).to.be.instanceOf(BrokenLinkError);
    });
  });
});

function testMixedResultsCase(httpStatusCodeForSecondLink: number, customAssertion: (error: Error) => void) {
  let checkedLinks: CheckedLink[];

  beforeAll(async () => {
    const httpService = new AxiosHttpService();
    const linkAdapter = new HTTPLinkAdapter(httpService);
    const step = new CheckForBrokenLinksStep(linkAdapter);
    checkedLinks = await step.execute([
      new Link('Test link 1', 'https://httpbingo.org/status/200'),
      new Link('Test link 2', `https://httpbingo.org/status/${httpStatusCodeForSecondLink}`),
    ]);
  });

  it('should return the list of mixed results', async () => {
    expect(checkedLinks[0].isBroken()).to.be.false;
    const result = checkedLinks[1];
    expect(checkedLinks[1].isBroken()).to.be.true;
    customAssertion(result.getError()!);
  });
}
