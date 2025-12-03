import { FileMutationHook } from './FileMutationHook';
import { VirtualFileSystem } from '../mcp/VirtualFileSystem';

/**
 * Manual test suite for FileMutationHook
 * Run this file with: npx tsx src/services/hooks/FileMutationHook.test.ts
 */

async function testFileMutationHook() {
  console.log('=== FileMutationHook Test Suite ===\n');

  // Setup
  const fs = new VirtualFileSystem();
  const hook = new FileMutationHook(fs);

  // Test 1: File registration
  console.log('Test 1: File registration');
  hook.registerFile('/test/file1.txt');
  hook.registerFile('/test/file2.txt');
  const registered = hook.getRegisteredFiles();
  console.log(`Registered files: ${registered.join(', ')}`);
  console.log(`✓ Registration works: ${registered.length === 2 ? 'PASS' : 'FAIL'}\n`);

  // Test 2: File unregistration
  console.log('Test 2: File unregistration');
  hook.unregisterFile('/test/file1.txt');
  const afterUnregister = hook.getRegisteredFiles();
  console.log(`Files after unregister: ${afterUnregister.join(', ')}`);
  console.log(`✓ Unregistration works: ${afterUnregister.length === 1 ? 'PASS' : 'FAIL'}\n`);

  // Test 3: File creation listener
  console.log('Test 3: File creation listener');
  let createdFilePath = '';
  hook.onFileCreated((path) => {
    createdFilePath = path;
    console.log(`  File created event: ${path}`);
  });
  
  await fs.createDirectory('/test');
  await fs.createFile('/test/newfile.txt', 'Test content');
  console.log(`✓ File creation listener: ${createdFilePath === '/test/newfile.txt' ? 'PASS' : 'FAIL'}\n`);

  // Test 4: Mutation algorithms
  console.log('Test 4: Mutation algorithms');
  
  // Create test file
  await fs.createFile('/test/mutate.txt', 'Hello world, this is a test file with some content.');
  hook.registerFile('/test/mutate.txt');
  
  const originalContent = await fs.readFile('/test/mutate.txt');
  console.log(`Original: ${originalContent}`);
  
  // Test corruption mutation
  await hook.triggerMutation('/test/mutate.txt');
  const mutated1 = await fs.readFile('/test/mutate.txt');
  console.log(`After mutation 1: ${mutated1}`);
  
  // Reset and test again
  await fs.updateFile('/test/mutate.txt', originalContent);
  await hook.triggerMutation('/test/mutate.txt');
  const mutated2 = await fs.readFile('/test/mutate.txt');
  console.log(`After mutation 2: ${mutated2}`);
  
  console.log(`✓ Mutations applied: ${mutated1 !== originalContent ? 'PASS' : 'FAIL'}\n`);

  // Test 5: Mutation preserves file structure
  console.log('Test 5: File structure preservation');
  const structuredContent = '{\n  "key": "value",\n  "number": 42\n}';
  await fs.updateFile('/test/mutate.txt', structuredContent);
  await hook.triggerMutation('/test/mutate.txt');
  const mutatedStructured = await fs.readFile('/test/mutate.txt');
  
  // Check if basic structure is preserved (braces, quotes)
  const hasOpenBrace = mutatedStructured.includes('{');
  const hasCloseBrace = mutatedStructured.includes('}');
  const hasQuotes = mutatedStructured.includes('"');
  
  console.log(`Original: ${structuredContent}`);
  console.log(`Mutated: ${mutatedStructured}`);
  console.log(`✓ Structure preserved: ${hasOpenBrace && hasCloseBrace && hasQuotes ? 'PASS' : 'FAIL'}\n`);

  // Test 6: Mutation performance (2-second target)
  console.log('Test 6: Mutation performance');
  await fs.updateFile('/test/mutate.txt', 'Performance test content');
  
  const startTime = performance.now();
  await hook.triggerMutation('/test/mutate.txt');
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`Duration: ${duration.toFixed(2)}ms`);
  console.log(`✓ Performance: ${duration < 2000 ? 'PASS' : 'FAIL'} (target: <2000ms)\n`);

  // Test 7: Mutation logging
  console.log('Test 7: Mutation logging');
  const logBefore = hook.getMutationLog().length;
  await hook.triggerMutation('/test/mutate.txt');
  const logAfter = hook.getMutationLog().length;
  const latestLog = hook.getMutationLog()[logAfter - 1];
  
  console.log(`Log entries before: ${logBefore}`);
  console.log(`Log entries after: ${logAfter}`);
  console.log(`Latest log: ${JSON.stringify(latestLog)}`);
  console.log(`✓ Logging works: ${logAfter > logBefore && latestLog.path === '/test/mutate.txt' ? 'PASS' : 'FAIL'}\n`);

  // Test 8: Command execution trigger
  console.log('Test 8: Command execution trigger');
  await fs.updateFile('/test/mutate.txt', 'Command trigger test');
  const beforeCommand = await fs.readFile('/test/mutate.txt');
  
  // Try multiple times since it's probabilistic (20% chance)
  let mutationTriggered = false;
  for (let i = 0; i < 20; i++) {
    hook.onCommandExecution('test-command');
    const afterCommand = await fs.readFile('/test/mutate.txt');
    if (afterCommand !== beforeCommand) {
      mutationTriggered = true;
      break;
    }
  }
  
  console.log(`✓ Command trigger: ${mutationTriggered ? 'PASS' : 'FAIL'}\n`);

  // Test 9: Ghost interaction trigger
  console.log('Test 9: Ghost interaction trigger');
  await fs.updateFile('/test/mutate.txt', 'Ghost interaction test');
  const beforeGhost = await fs.readFile('/test/mutate.txt');
  
  // Try multiple times since it's probabilistic (30% chance)
  let ghostMutationTriggered = false;
  for (let i = 0; i < 20; i++) {
    hook.onGhostInteraction('test-interaction');
    const afterGhost = await fs.readFile('/test/mutate.txt');
    if (afterGhost !== beforeGhost) {
      ghostMutationTriggered = true;
      break;
    }
  }
  
  console.log(`✓ Ghost trigger: ${ghostMutationTriggered ? 'PASS' : 'FAIL'}\n`);

  // Test 10: Multiple mutation types
  console.log('Test 10: Testing all mutation types');
  const mutationTypes = new Set<string>();
  
  for (let i = 0; i < 30; i++) {
    await fs.updateFile('/test/mutate.txt', 'Test content for mutation types');
    await hook.triggerMutation('/test/mutate.txt');
  }
  
  const logs = hook.getMutationLog();
  logs.forEach(log => mutationTypes.add(log.type));
  
  console.log(`Mutation types observed: ${Array.from(mutationTypes).join(', ')}`);
  console.log(`✓ All mutation types: ${mutationTypes.size === 3 ? 'PASS' : 'FAIL'} (expected: 3)\n`);

  console.log('=== All Tests Complete ===');
}

// Run tests if this file is executed directly
// Note: Disabled for browser environment
// if (import.meta.url === `file://${process.argv[1]}`) {
//   testFileMutationHook().catch(console.error);
// }

export { testFileMutationHook };
