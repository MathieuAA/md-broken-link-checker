import Link from '../links/Link';
import { BrokenCheckResult, CheckResult, CheckResultStatus } from './CheckResult';

export default class CheckedLink {
  private readonly error?: Error;

  constructor(
    private readonly link: Link,
    private readonly result: CheckResult
  ) {
    if (this.result.getStatus() === CheckResultStatus.BROKEN) {
      this.error = (this.result as BrokenCheckResult).getError();
    }
  }

  isBroken(): boolean {
    return this.result.getStatus() === CheckResultStatus.BROKEN;
  }

  getError() {
    return this.error;
  }

  getLinkTitle() {
    return this.link.getTitle();
  }

  getLinkValue() {
    return this.link.getValue();
  }
}
