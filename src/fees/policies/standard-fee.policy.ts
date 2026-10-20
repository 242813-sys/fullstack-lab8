import { FeePolicy } from '../fee-policy.interface.js';

export class StandardFeePolicy implements FeePolicy {
  readonly name = 'standard';

  calculate(creditHours: number, cgpa: number, ratePerCreditHour: number): number {
    return creditHours * ratePerCreditHour;
  }
}
