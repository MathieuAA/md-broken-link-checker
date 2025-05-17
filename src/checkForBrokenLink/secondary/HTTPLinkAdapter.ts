import axios, { AxiosError } from 'axios';
import LinkPort from '../../domain/LinkPort';
import Link from '../../domain/Link';
import NoContentError from './NoContentError';
import UnauthorizedError from './UnauthorizedError';
import NotFoundError from './NotFoundError';
import UnknownError from './UnknownError';
import ForbiddenError from "./ForbiddenError";

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

      HTTPLinkAdapter.handleError(error as Error, url);
    }
  }
  
  private static handleError(error: Error, url: URL): never {
    if (error instanceof AxiosError && error.response) {
      const statusCode = error.response.status;
      
      switch (statusCode) {
        case 401:
          throw new UnauthorizedError(url);
        case 403:
          throw new ForbiddenError(url);
        case 404:
          throw new NotFoundError(url);
      }
    }
    
    throw new UnknownError(url);
  }
}
