import LinkErrors from '../linkErrors/LinkErrors';

export interface CheckResult {
  getStatus: () => CheckResultStatus;
}

export class OkayCheckResult implements CheckResult {
  getStatus() {
    return CheckResultStatus.OKAY;
  }
}

export class BrokenCheckResult implements CheckResult {
  constructor(private readonly error: Error) {}

  getStatus(): CheckResultStatus {
    return CheckResultStatus.BROKEN;
  }

  getError(): LinkErrors {
    return this.error;
  }
}

export enum CheckResultStatus {
  OKAY = 'okay',
  BROKEN = 'broken',
}
