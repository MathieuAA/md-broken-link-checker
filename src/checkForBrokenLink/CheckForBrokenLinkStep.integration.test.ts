import { describe, expect, it, beforeAll } from 'vitest';
import Link from '../domain/Link';
import CheckForBrokenLinkStep from './CheckForBrokenLinkStep';
import HTTPLinkAdapter from './secondary/HTTPLinkAdapter';
import NotFoundError from "./secondary/NotFoundError";
import NoContentError from "./secondary/NoContentError";
import UnknownError from "./secondary/UnknownError";

describe('CheckForBrokenLinkStep - integration test', () => {
  describe('when the link is valid and working', () => {
    let caughtError: Error;

    beforeAll(async () => {
      const httpService = new HTTPLinkAdapter();
      const step = new CheckForBrokenLinkStep(httpService);
      try {
        await step.execute(new Link('Test link', 'https://httpstat.us/200'));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        caughtError = error as Error;
      }
    });

    it('should not fail', async () => {
      expect(caughtError).to.equal(undefined);
    });
  });

  describe('when the link is valid but there is no response (204)', () => {
    let step: CheckForBrokenLinkStep;

    beforeAll(async () => {
      const httpService = new HTTPLinkAdapter();
      step = new CheckForBrokenLinkStep(httpService);
    });

    it('should fail', async () => {
      await expect(() => step.execute(new Link('Test link', 'https://httpstat.us/204'))).rejects.toThrow(NoContentError);
    });
  });

  describe('when the link is invalid', () => {
    describe('because the ressource does not exist (404)', () => {
      let step: CheckForBrokenLinkStep;

      beforeAll(async () => {
        const httpService = new HTTPLinkAdapter();
        step = new CheckForBrokenLinkStep(httpService);
      });

      it('should fail', async () => {
        await expect(() => step.execute(new Link('Test link', 'https://httpstat.us/404'))).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe('when an unknown error appears', () => {
    let step: CheckForBrokenLinkStep;

    beforeAll(async () => {
      const httpService = new HTTPLinkAdapter();
      step = new CheckForBrokenLinkStep(httpService);
    });

    it('should fail', async () => {
      await expect(() => step.execute(new Link('Test link', 'https://httpstat.us/418'))).rejects.toThrow(UnknownError);
    });
  });
});
