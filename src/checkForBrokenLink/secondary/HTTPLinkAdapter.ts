import axios, {AxiosError, AxiosResponse} from 'axios';
import LinkPort from '../../domain/LinkPort';
import Link from '../../domain/Link';
import NotFoundError from './NotFoundError.js';
import NoContentError from "./NoContentError";
import UnknownError from "./UnknownError";

export default class HTTPLinkAdapter implements LinkPort {
  async checkValid(link: Link): Promise<void> {
    let response: AxiosResponse;
    try {
      response = await axios.head(link.getValue().toString());
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.status === 404) {
        throw new NotFoundError(link.getValue().toString())
      }
      throw new UnknownError(new URL(link.getValue()));
    }
    if (response.status === 204) {
      throw new NoContentError(new URL(link.getValue()));
    }
    return Promise.resolve();
  }
}
