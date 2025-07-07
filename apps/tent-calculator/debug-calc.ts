// Debug the actual calculator results
import { calculateTentDimensions } from './src/lib/tent-calculator';
import { DEFAULT_TARP_DIMENSIONS, DEFAULT_TENT_DIMENSIONS, DEFAULT_PADDING } from './src/types/tent';

// Test your exact example: 110cm floor, 5/3/5 padding
const result = calculateTentDimensions({
  tarpDimensions: DEFAULT_TARP_DIMENSIONS,
  tentDimensions: { ...DEFAULT_TENT_DIMENSIONS, floorWidth: 1.1 }, // 110cm
  paddingParameters: { 
    verticalPadding: 0.05,   // 5cm
    horizontalPadding: 0.03, // 3cm  
    endPadding: 0.05         // 5cm
  },
  calculationMode: 'solve_height'
});

console.log('=== Actual Calculator Results ===');
console.log(`Floor Width: ${(result.floorWidth * 100).toFixed(1)}cm`);
console.log(`Foot Height: ${(result.footHeight * 100).toFixed(1)}cm`);
console.log(`Head Height: ${(result.headHeight * 100).toFixed(1)}cm`);
console.log(`Is Valid: ${result.isValid}`);
console.log(`Warnings: ${result.warnings.join(', ')}`);

console.log('\n=== Expected vs Actual ===');
console.log(`Expected Foot: 15.5cm, Actual: ${(result.footHeight * 100).toFixed(1)}cm`);
console.log(`Expected Head: 0cm, Actual: ${(result.headHeight * 100).toFixed(1)}cm`);

if (Math.abs(result.footHeight * 100 - 15.5) > 1) {
  console.log('\n❌ FOOT HEIGHT MISMATCH - Calculator logic needs fixing!');
}

if (Math.abs(result.headHeight * 100 - 0) > 1) {
  console.log('\n❌ HEAD HEIGHT MISMATCH - Calculator logic needs fixing!');
}