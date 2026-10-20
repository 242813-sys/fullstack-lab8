import { StandardFeePolicy } from './policies/standard-fee.policy.js';
import { MeritFeePolicy } from './policies/merit-fee.policy.js';

describe('FeePolicies', () => {
  const rate = 5000;

  describe('StandardFeePolicy', () => {
    const policy = new StandardFeePolicy();

    it('should have policy name standard', () => {
      expect(policy.name).toBe('standard');
    });

    it('should calculate standard fee without CGPA discount', () => {
      const total = policy.calculate(12, 3.8, rate);
      expect(total).toBe(60000);
    });

    it('should calculate same fee regardless of lower CGPA', () => {
      const total = policy.calculate(10, 2.5, rate);
      expect(total).toBe(50000);
    });
  });

  describe('MeritFeePolicy', () => {
    const policy = new MeritFeePolicy();

    it('should have policy name merit', () => {
      expect(policy.name).toBe('merit');
    });

    it('should give 50% discount at the exact 3.5 boundary', () => {
      const total = policy.calculate(12, 3.5, rate);
      expect(total).toBe(30000);
    });

    it('should give 50% discount for CGPA above 3.5 (e.g., 3.8)', () => {
      const total = policy.calculate(12, 3.8, rate);
      expect(total).toBe(30000);
    });

    it('should give 25% discount at the exact 3.0 boundary', () => {
      const total = policy.calculate(12, 3.0, rate);
      expect(total).toBe(45000);
    });

    it('should give 25% discount for CGPA between 3.0 and 3.5 (e.g., 3.2)', () => {
      const total = policy.calculate(12, 3.2, rate);
      expect(total).toBe(45000);
    });

    it('should give no discount (full price) for CGPA below 3.0 (e.g., 2.8)', () => {
      const total = policy.calculate(12, 2.8, rate);
      expect(total).toBe(60000);
    });
  });
});
