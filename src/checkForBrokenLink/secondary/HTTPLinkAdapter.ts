import axios, { AxiosError, AxiosResponse } from 'axios';
import LinkPort from '../../domain/LinkPort';
import Link from '../../domain/Link';
import NotFoundError from './NotFoundError.js';
import NoContentError from './NoContentError';
import UnknownError from './UnknownError';

export default class HTTPLinkAdapter implements LinkPort {
  async checkValid(link: Link): Promise<void> {
    const url = link.getValue().toString();
    
    try {
      const response = await axios.head(url);
      
      if (response.status === 204) {
        throw new NoContentError(new URL(url));
      }
      
      return Promise.resolve();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new NotFoundError(url);
      }
      
      if (error instanceof NoContentError) {
        throw error;
      }

      throw new UnknownError(new URL(url));
    }
  }
}
