import { sum, average, max, min, isPrime } from './MathUtils.js';

const numbers = [1, 2, 3, 4, 5, 6];
const testNumber = 7;

console.log('Sum:', sum(numbers));          // Sum: 21
console.log('Average:', average(numbers));  // Average: 3.5
console.log('Max:', max(numbers));          // Max: 6
console.log('Min:', min(numbers));          // Min: 1
console.log(`Is ${testNumber} prime?`, isPrime(testNumber));  // Is 7 prime? true
