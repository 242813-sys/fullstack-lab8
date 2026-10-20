import { FeePolicy } from '../fee-policy.interface.js';

export class MeritFeePolicy implements FeePolicy {
  readonly name = 'merit';

  calculate(creditHours: number, cgpa: number, ratePerCreditHour: number): number {
    if (cgpa >= 3.5) {
      return creditHours * ratePerCreditHour * 0.5;
    } else if (cgpa >= 3.0) {
      return creditHours * ratePerCreditHour * 0.75;
    } else {
      return creditHours * ratePerCreditHour;
    }
  }
}
