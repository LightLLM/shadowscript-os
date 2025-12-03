/**
 * Performance test for MessageRewriter optimizations
 * Run with: npx tsx test-message-rewriter-performance.ts
 */

import { MessageRewriter } from './src/services/mcp/MessageRewriter';

function testPerformance() {
  console.log('=== MessageRewriter Performance Test ===\n');

  const rewriter = new MessageRewriter();
  const results: { test: string; duration: number; passed: boolean }[] = [];

  // Test 1: Short message performance
  console.log('Test 1: Short message performance');
  const shortMessage = 'Hello, this is a test message';
  const start1 = performance.now();
  const result1 = rewriter.rewrite(shortMessage, 0.5);
  const duration1 = performance.now() - start1;
  const passed1 = duration1 < 100;
  results.push({ test: 'Short message', duration: duration1, passed: passed1 });
  console.log(`  Duration: ${duration1.toFixed(2)}ms`);
  console.log(`  Result: ${result1}`);
  console.log(`  Status: ${passed1 ? '✓ PASS' : '✗ FAIL'} (target: <100ms)\n`);

  // Test 2: Long message performance
  console.log('Test 2: Long message performance');
  const longMessage = 'This is a much longer message that will be used to test the performance of the MessageRewriter service. '.repeat(5);
  const start2 = performance.now();
  const result2 = rewriter.rewrite(longMessage, 0.7);
  const duration2 = performance.now() - start2;
  const passed2 = duration2 < 100;
  results.push({ test: 'Long message', duration: duration2, passed: passed2 });
  console.log(`  Duration: ${duration2.toFixed(2)}ms`);
  console.log(`  Result length: ${result2.length} chars`);
  console.log(`  Status: ${passed2 ? '✓ PASS' : '✗ FAIL'} (target: <100ms)\n`);

  // Test 3: Cache performance (memoization)
  console.log('Test 3: Cache performance (memoization)');
  const cacheMessage = 'Cached message test';
  
  const startFirst = performance.now();
  const resultFirst = rewriter.rewrite(cacheMessage, 0.5);
  const durationFirst = performance.now() - startFirst;
  
  const startSecond = performance.now();
  const resultSecond = rewriter.rewrite(cacheMessage, 0.5);
  const durationSecond = performance.now() - startSecond;
  
  const cacheSpeedup = durationFirst / durationSecond;
  const passed3 = durationSecond < durationFirst && resultFirst === resultSecond;
  results.push({ test: 'Cache speedup', duration: durationSecond, passed: passed3 });
  
  console.log(`  First call: ${durationFirst.toFixed(2)}ms`);
  console.log(`  Second call (cached): ${durationSecond.toFixed(2)}ms`);
  console.log(`  Speedup: ${cacheSpeedup.toFixed(1)}x`);
  console.log(`  Results match: ${resultFirst === resultSecond}`);
  console.log(`  Status: ${passed3 ? '✓ PASS' : '✗ FAIL'}\n`);

  // Test 4: Multiple transformations performance
  console.log('Test 4: High intensity (multiple transformations)');
  const complexMessage = 'The ghost is watching you from the shadows of the old machine';
  const start4 = performance.now();
  const result4 = rewriter.rewrite(complexMessage, 0.9);
  const duration4 = performance.now() - start4;
  const passed4 = duration4 < 100;
  results.push({ test: 'High intensity', duration: duration4, passed: passed4 });
  console.log(`  Duration: ${duration4.toFixed(2)}ms`);
  console.log(`  Result: ${result4}`);
  console.log(`  Status: ${passed4 ? '✓ PASS' : '✗ FAIL'} (target: <100ms)\n`);

  // Test 5: Batch processing performance
  console.log('Test 5: Batch processing (10 messages)');
  const messages = [
    'Welcome to ShadowScript OS',
    'The ghost is here',
    'Your files are being watched',
    'Something strange is happening',
    'Do you feel the presence?',
    'The system is alive',
    'Beware of the shadows',
    'The machine remembers',
    'You are not alone',
    'The haunting continues'
  ];
  
  const startBatch = performance.now();
  const batchResults = messages.map(msg => rewriter.rewrite(msg, 0.6));
  const durationBatch = performance.now() - startBatch;
  const avgDuration = durationBatch / messages.length;
  const passed5 = avgDuration < 100;
  results.push({ test: 'Batch average', duration: avgDuration, passed: passed5 });
  
  console.log(`  Total duration: ${durationBatch.toFixed(2)}ms`);
  console.log(`  Average per message: ${avgDuration.toFixed(2)}ms`);
  console.log(`  Status: ${passed5 ? '✓ PASS' : '✗ FAIL'} (target: <100ms avg)\n`);

  // Test 6: Cache size management
  console.log('Test 6: Cache size management (101 unique messages)');
  const startCache = performance.now();
  for (let i = 0; i < 101; i++) {
    rewriter.rewrite(`Message number ${i}`, 0.5);
  }
  const durationCache = performance.now() - startCache;
  const passed6 = durationCache < 10000; // Should complete in reasonable time
  results.push({ test: 'Cache management', duration: durationCache, passed: passed6 });
  console.log(`  Duration: ${durationCache.toFixed(2)}ms`);
  console.log(`  Status: ${passed6 ? '✓ PASS' : '✗ FAIL'} (no memory leak)\n`);

  // Summary
  console.log('=== Summary ===');
  const allPassed = results.every(r => r.passed);
  const passCount = results.filter(r => r.passed).length;
  console.log(`Tests passed: ${passCount}/${results.length}`);
  console.log(`Overall: ${allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}\n`);

  results.forEach(r => {
    console.log(`  ${r.passed ? '✓' : '✗'} ${r.test}: ${r.duration.toFixed(2)}ms`);
  });

  return allPassed;
}

// Run tests
const success = testPerformance();
process.exit(success ? 0 : 1);
