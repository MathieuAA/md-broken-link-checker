import BrokenLinkError from '../links/BrokenLinkError';

export interface CheckResult {
  getStatus: () => CheckResultStatus;
}

export class OkayCheckResult implements CheckResult {
  getStatus() {
    return CheckResultStatus.OKAY;
  }
}

export class BrokenCheckResult implements CheckResult {
  constructor(private readonly error: BrokenLinkError) {}

  getStatus(): CheckResultStatus {
    return CheckResultStatus.BROKEN;
  }

  getError(): BrokenLinkError {
    return this.error;
  }
}

export enum CheckResultStatus {
  OKAY = 'okay',
  BROKEN = 'broken',
}
