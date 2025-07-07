// Quick calculation verification script
// Run with: node test-calculations.js

// Import the default values (simulate the imports)
const DEFAULT_TARP_DIMENSIONS = {
  shortSide: 1.5,
  longSide: 2.15,
  diagonalSide: 2.175,
  usableLength: 2.15
};

const DEFAULT_TENT_DIMENSIONS = {
  length: 2.0,
  footBaseWidth: 0.75,
  headBaseWidth: 1.075
};

const DEFAULT_PADDING = {
  verticalPadding: 0.05, // 5cm
  horizontalPadding: 0.03, // 3cm
  endPadding: 0.05 // 5cm
};

// Manual calculation for 110cm floor width
function manualCalculation() {
  const floorWidthCm = 110;
  const horizontalPaddingCm = 3;
  const verticalPaddingCm = 5;
  
  // Step 1: Calculate required outer width
  const requiredOuterWidthCm = floorWidthCm + (2 * horizontalPaddingCm);
  console.log(`Step 1: Required outer width = ${floorWidthCm}cm + ${2 * horizontalPaddingCm}cm padding = ${requiredOuterWidthCm}cm`);
  
  // Step 2: Calculate expansion needed for each base
  const footBaseCm = 75;
  const headBaseCm = 108; // 107.5 rounded
  
  const footExpansionCm = requiredOuterWidthCm - footBaseCm;
  const headExpansionCm = requiredOuterWidthCm - headBaseCm;
  
  console.log(`Step 2: Foot expansion needed = ${requiredOuterWidthCm}cm - ${footBaseCm}cm = ${footExpansionCm}cm`);
  console.log(`Step 2: Head expansion needed = ${requiredOuterWidthCm}cm - ${headBaseCm}cm = ${headExpansionCm}cm`);
  
  // Step 3: Calculate heights (assuming 45-degree walls: height = horizontal_expansion / 2)
  const tentWallSlope = 1.0; // 45-degree walls
  const footHeightCm = (footExpansionCm / 2) / tentWallSlope;
  const headHeightCm = (headExpansionCm / 2) / tentWallSlope;
  
  console.log(`Step 3: Foot height = (${footExpansionCm}/2) / ${tentWallSlope} = ${footHeightCm}cm`);
  console.log(`Step 3: Head height = (${headExpansionCm}/2) / ${tentWallSlope} = ${headHeightCm}cm`);
  
  // Step 4: Subtract vertical padding for inner height
  const innerFootHeightCm = footHeightCm - verticalPaddingCm;
  const innerHeadHeightCm = headHeightCm - verticalPaddingCm;
  
  console.log(`Step 4: Inner foot height = ${footHeightCm}cm - ${verticalPaddingCm}cm = ${innerFootHeightCm}cm`);
  console.log(`Step 4: Inner head height = ${headHeightCm}cm - ${verticalPaddingCm}cm = ${innerHeadHeightCm}cm`);
  
  return {
    floorWidth: floorWidthCm,
    footHeight: Math.max(0, innerFootHeightCm),
    headHeight: Math.max(0, innerHeadHeightCm)
  };
}

// Test different floor widths
function testMultipleWidths() {
  const testWidths = [80, 90, 100, 110, 120]; // cm
  
  console.log('\n=== Testing Multiple Floor Widths ===');
  testWidths.forEach(width => {
    console.log(`\n--- Floor Width: ${width}cm ---`);
    
    const requiredOuter = width + 6; // 3cm padding each side
    const footExpansion = requiredOuter - 75;
    const headExpansion = requiredOuter - 108;
    
    const footHeight = Math.max(0, (footExpansion / 2) - 5); // 45-degree walls, 5cm vertical padding
    const headHeight = Math.max(0, (headExpansion / 2) - 5);
    
    console.log(`Required outer: ${requiredOuter}cm`);
    console.log(`Foot expansion: ${footExpansion}cm → height: ${footHeight}cm`);
    console.log(`Head expansion: ${headExpansion}cm → height: ${headHeight}cm`);
    console.log(`Foot vs Head: ${footHeight > headHeight ? 'Foot higher' : headHeight > footHeight ? 'Head higher' : 'Equal'}`);
  });
}

// Test edge cases
function testEdgeCases() {
  console.log('\n=== Edge Cases ===');
  
  // Case 1: Floor width equals foot base
  console.log('\n--- Floor = Foot Base (75cm) ---');
  const footBaseFloor = 75 + 6; // Add padding
  console.log(`Target: 75cm floor + 6cm padding = ${footBaseFloor}cm outer`);
  console.log(`Foot expansion: ${footBaseFloor - 75}cm`);
  console.log(`Head expansion: ${footBaseFloor - 108}cm (negative - impossible!)`);
  
  // Case 2: Floor width equals head base
  console.log('\n--- Floor = Head Base (108cm) ---');
  const headBaseFloor = 108 + 6;
  console.log(`Target: 108cm floor + 6cm padding = ${headBaseFloor}cm outer`);
  console.log(`Foot expansion: ${headBaseFloor - 75}cm`);
  console.log(`Head expansion: ${headBaseFloor - 108}cm`);
}

// Run all tests
console.log('=== Manual Tent Calculation Verification ===\n');

console.log('--- Your Example: 110cm Floor Width ---');
const result = manualCalculation();
console.log(`\nFINAL RESULT: Floor=${result.floorWidth}cm, Foot=${result.footHeight}cm, Head=${result.headHeight}cm`);

testMultipleWidths();
testEdgeCases();

console.log('\n=== Analysis ===');
console.log('Key insights:');
console.log('1. For rectangular floors, foot is always higher than head (foot base is narrower)');
console.log('2. Floor widths < 81cm (75cm + 6cm padding) are impossible at head end');
console.log('3. Floor widths > 114cm (108cm + 6cm padding) require significant foot height');
console.log('4. Your 110cm example should give: Foot ≈ 15.5cm, Head ≈ -1cm → 0cm');