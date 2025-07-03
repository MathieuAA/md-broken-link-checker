import LinkPort from '../../../domain/links/LinkPort';
import Link from '../../../domain/links/Link';
import BrokenLinkError from '../../../domain/links/BrokenLinkError';
import NoContentForLinkError from '../../../domain/links/NoContentForLinkError';
import HttpService from '../../../shared/http/HttpService';

export default class HTTPLinkAdapter implements LinkPort {
  constructor(private readonly httpService: HttpService) {}

  async checkValid(link: Link): Promise<void> {
    const url = link.getValue();

    try {
      const response = await this.httpService.head(url);

      if (response.status === 204) {
        throw new NoContentForLinkError(link);
      }
    } catch (error) {
      if (error instanceof NoContentForLinkError) {
        throw error;
      }

      throw new BrokenLinkError(link, error as unknown as Error);
    }
  }
}
