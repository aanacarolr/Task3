/**
 * Math utility functions
 */

/**
 * Calculates the sum of an array of numbers
 * @param {number[]} numbers - Array of numbers to sum
 * @returns {number} The sum of all numbers
 */
export function sum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('Input must be an array');
  }
  return numbers.reduce((acc, num) => {
    if (typeof num !== 'number') {
      throw new TypeError('All elements must be numbers');
    }
    return acc + num;
  }, 0);
}

/**
 * Calculates the average of an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The average of all numbers
 */
export function average(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('Input must be an array');
  }
  if (numbers.length === 0) {
    throw new Error('Array cannot be empty');
  }
  return sum(numbers) / numbers.length;
}

/**
 * Finds the maximum value in an array of numbers (ignoring non-numeric and NaN)
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The maximum value
 */
export function max(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('Input must be an array');
  }
  const filtered = numbers.filter(num => typeof num === 'number' && !isNaN(num));
  if (filtered.length === 0) {
    throw new Error('Array must contain at least one valid number');
  }
  return Math.max(...filtered);
}

/**
 * Finds the minimum value in an array of numbers (ignoring non-numeric and NaN)
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The minimum value
 */
export function min(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError('Input must be an array');
  }
  const filtered = numbers.filter(num => typeof num === 'number' && !isNaN(num));
  if (filtered.length === 0) {
    throw new Error('Array must contain at least one valid number');
  }
  return Math.min(...filtered);
}

/**
 * Checks if a number is prime
 * @param {number} num - The number to check
 * @returns {boolean} True if the number is prime
 */
export function isPrime(num) {
  if (typeof num !== 'number') {
    throw new TypeError('Input must be a number');
  }
  if (num < 2 || !Number.isInteger(num)) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}
