import axios, { AxiosError } from 'axios';
import LinkPort from '../../domain/LinkPort';
import Link from '../../domain/Link';
import NoContentError from '../../domain/linkErrors/NoContentError';
import UnauthorizedAccessError from '../../domain/linkErrors/UnauthorizedAccessError';
import NotFoundError from '../../domain/linkErrors/NotFoundError';
import UnknownError from '../../domain/linkErrors/UnknownError';
import ForbiddenAccessError from '../../domain/linkErrors/ForbiddenAccessError';

export default class HTTPLinkAdapter implements LinkPort {
  async checkValid(link: Link): Promise<void> {
    const url = link.getValue();

    try {
      const response = await axios.head(url.toString());

      if (response.status === 204) {
        throw new NoContentError(url);
      }
    } catch (error) {
      if (error instanceof NoContentError) {
        throw error;
      }

      HTTPLinkAdapter.handleError(error as Error, link);
    }
  }

  private static handleError(error: Error, link: Link): never {
    if (error instanceof AxiosError && error.response) {
      const statusCode = error.response.status;

      switch (statusCode) {
        case 401:
          throw new UnauthorizedAccessError(link);
        case 403:
          throw new ForbiddenAccessError(link);
        case 404:
          throw new NotFoundError(link);
        default:
          throw new UnknownError(link, { statusCode });
      }
    }

    throw new UnknownError(link, { error: { name: error.name, message: error.message } });
  }
}
