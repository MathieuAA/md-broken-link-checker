import { describe, expect, it, beforeAll } from 'vitest';
import Link from '../domain/Link';
import CheckForBrokenLinks from './CheckForBrokenLinks';
import HTTPLinkAdapter from './secondary/HTTPLinkAdapter';
import NotFoundError from '../domain/linkErrors/NotFoundError';
import NoContentError from '../domain/linkErrors/NoContentError';
import UnknownError from '../domain/linkErrors/UnknownError';
import UnauthorizedAccessError from '../domain/linkErrors/UnauthorizedAccessError';
import ForbiddenAccessError from '../domain/linkErrors/ForbiddenAccessError';

describe('CheckForBrokenLinkStep - integration test', () => {
  describe('when the link is valid and working', () => {
    let caughtError: Error;

    beforeAll(async () => {
      const httpService = new HTTPLinkAdapter();
      const step = new CheckForBrokenLinks(httpService);
      try {
        await step.execute(new Link('Test link', 'https://httpstat.us/200'));
      } catch (error) {
        caughtError = error as Error;
      }
    });

    it('should not fail', async () => {
      expect(caughtError).to.equal(undefined);
    });
  });

  describe('when the link is valid but there is no response (204)', () => {
    let step: CheckForBrokenLinks;

    beforeAll(async () => {
      const httpService = new HTTPLinkAdapter();
      step = new CheckForBrokenLinks(httpService);
    });

    it('should fail', async () => {
      await expect(() => step.execute(new Link('Test link', 'https://httpstat.us/204'))).rejects.toThrow(
        NoContentError
      );
    });
  });

  describe('when the link is valid but an authorization is needed (401)', () => {
    let step: CheckForBrokenLinks;

    beforeAll(async () => {
      const httpService = new HTTPLinkAdapter();
      step = new CheckForBrokenLinks(httpService);
    });

    it('should fail', async () => {
      await expect(() => step.execute(new Link('Test link', 'https://httpstat.us/401'))).rejects.toThrow(
        UnauthorizedAccessError
      );
    });
  });

  describe('when the link is valid but it is forbidden (403)', () => {
    let step: CheckForBrokenLinks;

    beforeAll(async () => {
      const httpService = new HTTPLinkAdapter();
      step = new CheckForBrokenLinks(httpService);
    });

    it('should fail', async () => {
      await expect(() => step.execute(new Link('Test link', 'https://httpstat.us/403'))).rejects.toThrow(
        ForbiddenAccessError
      );
    });
  });

  describe('when the link is invalid', () => {
    describe('because the ressource does not exist (404)', () => {
      let step: CheckForBrokenLinks;

      beforeAll(async () => {
        const httpService = new HTTPLinkAdapter();
        step = new CheckForBrokenLinks(httpService);
      });

      it('should fail', async () => {
        await expect(() => step.execute(new Link('Test link', 'https://httpstat.us/404'))).rejects.toThrow(
          NotFoundError
        );
      });
    });
  });

  describe('when an unknown error appears', () => {
    let step: CheckForBrokenLinks;

    beforeAll(async () => {
      const httpService = new HTTPLinkAdapter();
      step = new CheckForBrokenLinks(httpService);
    });

    it('should fail', async () => {
      await expect(() => step.execute(new Link('Test link', 'https://httpstat.us/418'))).rejects.toThrow(UnknownError);
    });
  });
});
