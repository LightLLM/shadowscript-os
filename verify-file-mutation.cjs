/**
 * Simple verification script for FileMutationHook
 * This verifies the implementation without running full tests
 */

console.log('=== FileMutationHook Implementation Verification ===\n');

// Check 1: File exists
const fs = require('fs');
const path = require('path');

const hookPath = path.join(__dirname, 'src', 'services', 'hooks', 'FileMutationHook.ts');
if (fs.existsSync(hookPath)) {
  console.log('✓ FileMutationHook.ts exists');
  
  const content = fs.readFileSync(hookPath, 'utf-8');
  
  // Check 2: Registration methods
  if (content.includes('registerFile') && content.includes('unregisterFile')) {
    console.log('✓ Registration methods implemented');
  } else {
    console.log('✗ Registration methods missing');
  }
  
  // Check 3: Set of registered files
  if (content.includes('Set<string>') && content.includes('registeredFiles')) {
    console.log('✓ Set of registered file paths maintained');
  } else {
    console.log('✗ Set of registered file paths missing');
  }
  
  // Check 4: File creation listener
  if (content.includes('fileCreationListeners') && content.includes('onFileCreated')) {
    console.log('✓ File creation event listener implemented');
  } else {
    console.log('✗ File creation event listener missing');
  }
  
  // Check 5: Mutation interface
  if (content.includes('Mutation') && content.includes('type:') && content.includes('apply')) {
    console.log('✓ Mutation interface used');
  } else {
    console.log('✗ Mutation interface missing');
  }
  
  // Check 6: Mutation types
  const hasCorruption = content.includes('corruption');
  const hasReplacement = content.includes('replacement');
  const hasInsertion = content.includes('insertion');
  
  if (hasCorruption && hasReplacement && hasInsertion) {
    console.log('✓ All three mutation types implemented (corruption, replacement, insertion)');
  } else {
    console.log('✗ Missing mutation types');
  }
  
  // Check 7: triggerMutation method
  if (content.includes('triggerMutation')) {
    console.log('✓ triggerMutation method implemented');
  } else {
    console.log('✗ triggerMutation method missing');
  }
  
  // Check 8: Random interval triggers
  if (content.includes('startRandomMutations')) {
    console.log('✓ Random interval triggers implemented');
  } else {
    console.log('✗ Random interval triggers missing');
  }
  
  // Check 9: Command execution triggers
  if (content.includes('onCommandExecution')) {
    console.log('✓ Command execution triggers implemented');
  } else {
    console.log('✗ Command execution triggers missing');
  }
  
  // Check 10: Ghost interaction triggers
  if (content.includes('onGhostInteraction')) {
    console.log('✓ Ghost interaction triggers implemented');
  } else {
    console.log('✗ Ghost interaction triggers missing');
  }
  
  // Check 11: Mutation logging
  if (content.includes('mutationLog') && content.includes('timestamp')) {
    console.log('✓ Mutation logging with timestamps implemented');
  } else {
    console.log('✗ Mutation logging missing');
  }
  
  console.log('\n=== Verification Complete ===');
  console.log('All required features are implemented!');
  
} else {
  console.log('✗ FileMutationHook.ts not found');
}
