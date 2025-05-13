import axios from 'axios';
import LinkPort from '../../domain/LinkPort';
import Link from '../../domain/Link';

export default class HTTPLinkAdapter implements LinkPort {
  async checkValid(link: Link): Promise<void> {
    try {
      await axios.head(link.getValue());
      return Promise.resolve();
    } catch (error) {
      console.error(error);
      return Promise.reject();
    }
  }
}
