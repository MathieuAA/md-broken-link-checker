import Link from './Link';

export default interface LinkPort {
  checkValid(link: Link): Promise<void>;
}
