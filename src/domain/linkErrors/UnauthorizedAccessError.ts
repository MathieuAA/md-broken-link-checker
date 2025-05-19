import Link from "../Link";

export default class UnauthorizedAccessError extends Error {
  constructor(link: Link) {
    super(`Unauthorized access: "${link.getValue()}".`);
    this.name = 'UnauthorizedAccessError';
  }
}
