import axios, { AxiosError } from 'axios';
import LinkPort from '../../domain/links/LinkPort';
import Link from '../../domain/links/Link';
import {
  ForbiddenAccessError,
  NoContentError,
  NotFoundError,
  UnauthorizedAccessError,
  UnknownError,
} from '../../domain/linkErrors/LinkErrors';

export default class HTTPLinkAdapter implements LinkPort {
  async checkValid(link: Link): Promise<void> {
    const url = link.getValue();

    try {
      const response = await axios.head(url.toString());

      if (response.status === 204) {
        throw new NoContentError(link);
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
