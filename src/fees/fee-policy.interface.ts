export const FEE_POLICY = Symbol('FEE_POLICY');

export interface FeePolicy {
  readonly name: string;
  calculate(creditHours: number, cgpa: number, ratePerCreditHour: number): number;
}
