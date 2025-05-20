import Link from '../links/Link';
import { CheckResult } from './CheckResult';

export default interface CheckedLink {
  link: Link;
  result: CheckResult;
}
