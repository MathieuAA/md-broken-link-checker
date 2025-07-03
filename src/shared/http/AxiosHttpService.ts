import axios, { AxiosError } from 'axios';
import HttpService, { HttpResponse } from './HttpService';
import { ForbiddenAccessError, NotFoundError, UnauthorizedAccessError, UnknownError } from './HttpErrors';

export default class AxiosHttpService implements HttpService {
  head(url: URL): Promise<HttpResponse> {
    try {
      return axios.head(url.toString());
    } catch (error) {
      AxiosHttpService.handleError(url, error as unknown as Error);
    }
  }

  private static handleError(url: URL, error: Error): never {
    if (error instanceof AxiosError && error.response) {
      const statusCode = error.response.status;

      switch (statusCode) {
        case 401:
          throw new UnauthorizedAccessError(url);
        case 403:
          throw new ForbiddenAccessError(url);
        case 404:
          throw new NotFoundError(url);
        default:
          throw new UnknownError(url, { statusCode });
      }
    }

    throw new UnknownError(url, { error: { name: error.name, message: error.message } });
  }
}
