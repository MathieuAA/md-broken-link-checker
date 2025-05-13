import { describe, expect, it, beforeAll } from 'vitest';
import Link from '../domain/Link';
import CheckForBrokenLinkStep from './CheckForBrokenLinkStep';
import HTTPLinkAdapter from './secondary/HTTPLinkAdapter';

describe('CheckForBrokenLinkStep - integration test', () => {
  describe('when the link is valid and working', () => {
    let caughtError: Error;

    beforeAll(async () => {
      const httpService = new HTTPLinkAdapter();
      const step = new CheckForBrokenLinkStep(httpService);
      try {
        await step.execute(new Link('Test link', 'https://www.google.fr/'));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        caughtError = error as Error;
      }
    });

    it('should not fail', async () => {
      expect(caughtError).to.equal(undefined);
    });
  });

  describe('when the link is invalid', () => {
    describe('because the ressource does not exist (404)', () => {
      let caughtError: Error;

      beforeAll(async () => {
        const httpService = new HTTPLinkAdapter();
        const step = new CheckForBrokenLinkStep(httpService);
        try {
          await step.execute(new Link('Test link', 'https://invalid.fr/'));
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          caughtError = error as Error;
        }
      });

      it('should fail', async () => {
        expect(caughtError).to.equal(undefined);
      });
    });
  });
});
