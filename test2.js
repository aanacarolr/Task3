import { sum, average, max, min, isPrime } from './MathUtils.js';

const numbers = [11, 25, 35, 87, 95, 46];
const testNumber = 88;

console.log('Sum:', sum(numbers));          
console.log('Average:', average(numbers));  
console.log('Max:', max(numbers));          
console.log('Min:', min(numbers));          
console.log(`Is ${testNumber} prime?`, isPrime(testNumber)); 
