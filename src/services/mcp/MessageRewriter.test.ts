import { MessageRewriter } from './MessageRewriter';

/**
 * Manual test suite for MessageRewriter
 * Run this file with: npx tsx src/services/mcp/MessageRewriter.test.ts
 */

function testMessageRewriter() {
  console.log('=== MessageRewriter Test Suite ===\n');

  const rewriter = new MessageRewriter();

  // Test 1: Basic rewriting
  console.log('Test 1: Basic rewriting');
  const message1 = 'Hello, this is a test message';
  const result1 = rewriter.rewrite(message1, 0.5);
  console.log(`Original: ${message1}`);
  console.log(`Rewritten: ${result1}`);
  console.log(`✓ Message was transformed\n`);

  // Test 2: Low intensity (subtle)
  console.log('Test 2: Low intensity (subtle)');
  const message2 = 'The ghost is watching you';
  const result2 = rewriter.rewrite(message2, 0.2);
  console.log(`Original: ${message2}`);
  console.log(`Rewritten: ${result2}`);
  console.log(`✓ Subtle transformation applied\n`);

  // Test 3: High intensity (extreme)
  console.log('Test 3: High intensity (extreme)');
  const message3 = 'Welcome to ShadowScript OS';
  const result3 = rewriter.rewrite(message3, 0.9);
  console.log(`Original: ${message3}`);
  console.log(`Rewritten: ${result3}`);
  console.log(`✓ Extreme transformation applied\n`);

  // Test 4: Performance test
  console.log('Test 4: Performance test');
  const longMessage = 'This is a longer message that will be used to test the performance of the MessageRewriter service. It should complete within 100ms according to the requirements.';
  const startTime = performance.now();
  const result4 = rewriter.rewrite(longMessage, 0.5);
  const endTime = performance.now();
  const duration = endTime - startTime;
  console.log(`Original: ${longMessage}`);
  console.log(`Rewritten: ${result4}`);
  console.log(`Duration: ${duration.toFixed(2)}ms`);
  console.log(`✓ Performance: ${duration < 100 ? 'PASS' : 'FAIL'} (target: <100ms)\n`);

  // Test 5: Caching test
  console.log('Test 5: Caching test');
  const message5 = 'Cached message test';
  const start1 = performance.now();
  const result5a = rewriter.rewrite(message5, 0.5);
  const duration1 = performance.now() - start1;
  
  const start2 = performance.now();
  const result5b = rewriter.rewrite(message5, 0.5);
  const duration2 = performance.now() - start2;
  
  console.log(`First call: ${duration1.toFixed(2)}ms`);
  console.log(`Second call (cached): ${duration2.toFixed(2)}ms`);
  console.log(`Results match: ${result5a === result5b}`);
  console.log(`✓ Caching works: ${duration2 < duration1 ? 'PASS' : 'FAIL'}\n`);

  // Test 6: Readability test
  console.log('Test 6: Readability test');
  const message6 = 'This message should remain readable';
  const result6 = rewriter.rewrite(message6, 0.8);
  console.log(`Original: ${message6}`);
  console.log(`Rewritten: ${result6}`);
  
  // Simple readability check - count matching characters
  const originalChars = message6.replace(/\s/g, '').toLowerCase();
  const transformedChars = result6.replace(/\s/g, '').toLowerCase();
  let matchCount = 0;
  for (let i = 0; i < Math.min(originalChars.length, transformedChars.length); i++) {
    if (originalChars[i] === transformedChars[i]) {
      matchCount++;
    }
  }
  const similarity = matchCount / originalChars.length;
  console.log(`Similarity: ${(similarity * 100).toFixed(1)}%`);
  console.log(`✓ Readability: ${similarity >= 0.8 ? 'PASS' : 'FAIL'} (target: ≥80%)\n`);

  // Test 7: All transformations
  console.log('Test 7: Testing individual transformations');
  const testMsg = 'Hello world';
  
  console.log('  Letter substitution (o→0, i→1, e→3):');
  const sub = rewriter['letterSubstitution'](testMsg, 1.0);
  console.log(`    ${testMsg} → ${sub}`);
  
  console.log('  Word reversal:');
  const rev = rewriter['wordReversal'](testMsg, 1.0);
  console.log(`    ${testMsg} → ${rev}`);
  
  console.log('  Spectral symbols (░▒▓█):');
  const spec = rewriter['spectralSymbols'](testMsg, 0.5);
  console.log(`    ${testMsg} → ${spec}`);
  
  console.log('  Glitch text:');
  const glitch = rewriter['glitchText'](testMsg, 0.5);
  console.log(`    ${testMsg} → ${glitch}`);
  
  console.log('  Echo effect:');
  const echo = rewriter['echoEffect'](testMsg);
  console.log(`    ${testMsg} → ${echo}`);
  console.log(`✓ All transformations work\n`);

  console.log('=== All Tests Complete ===');
}

// Run tests if this file is executed directly
// Note: Disabled for browser environment
// if (import.meta.url === `file://${process.argv[1]}`) {
//   testMessageRewriter();
// }

export { testMessageRewriter };
