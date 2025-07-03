import Link from './Link';

export default class BrokenLinkError extends Error {
  constructor(link: Link, error: Error) {
    super(`${error.name}: "${link.getValue()}".`);
    this.name = error.name;
  }
}
