import { sum, average, max, min, isPrime } from './MathUtils.js';

describe('MathUtils', () => {
  test('sum adds numbers', () => {
    expect(sum([1, 2, 3])).toBe(6);
  });

  test('average computes correctly', () => {
    expect(average([2, 4, 6])).toBe(4);
  });

  test('max finds highest', () => {
    expect(max([3, 8, 1])).toBe(8);
  });

  test('min finds lowest', () => {
    expect(min([5, 2, 9])).toBe(2);
  });

  test('isPrime detects primes', () => {
    expect(isPrime(7)).toBe(true);
    expect(isPrime(8)).toBe(false);
  });
});
