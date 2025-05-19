import Link from "../Link";

export default class ForbiddenAccessError extends Error {
  constructor(link: Link) {
    super(`Forbidden access: "${link.getValue()}".`);
    this.name = 'ForbiddenError';
  }
}
