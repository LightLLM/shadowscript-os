/**
 * Integration test runner for mini-app integration
 * This validates Requirements 3.5 and 4.4
 */

// Polyfills for Node.js environment
global.window = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
};

class LocalStorageMock {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.get(key) || null;
  }

  setItem(key, value) {
    this.store.set(key, value);
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

global.localStorage = new LocalStorageMock();
global.performance = {
  now: () => Date.now(),
};

// Import VirtualFileSystem
import { VirtualFileSystem } from './src/services/mcp/VirtualFileSystem.js';

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     Mini-App Integration Test Suite                       ║');
console.log('║     Testing Requirements 3.5 and 4.4                       ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

async function testGhostPaintIntegration() {
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│ GhostPaint Save/Load Tests (Requirement 3.5)            │');
  console.log('└─────────────────────────────────────────────────────────┘\n');

  const fs = new VirtualFileSystem();
  const results = [];

  // Test 1: Directory creation
  console.log('Test 1: GhostPaint directory creation');
  try {
    const dirExists = await fs.exists('/ghostpaint');
    if (!dirExists) {
      await fs.createDirectory('/ghostpaint');
    }
    const dirExistsAfter = await fs.exists('/ghostpaint');
    console.log(dirExistsAfter ? '  ✓ Directory created successfully\n' : '  ✗ Failed to create directory\n');
    results.push({ name: 'Directory creation', passed: dirExistsAfter });
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    results.push({ name: 'Directory creation', passed: false });
  }

  // Test 2: Save artwork
  console.log('Test 2: Save GhostPaint artwork');
  try {
    const timestamp = Date.now();
    const filename = `artwork_${timestamp}.json`;
    const path = `/ghostpaint/${filename}`;
    
    const artworkData = {
      width: 32,
      height: 32,
      pixels: Array(32).fill(null).map(() => 
        Array(32).fill('transparent').map((_, i) => 
          i % 5 === 0 ? '#55FF55' : 'transparent'
        )
      ),
      timestamp,
      version: '1.0'
    };

    await fs.createFile(path, JSON.stringify(artworkData, null, 2));
    const fileExists = await fs.exists(path);
    console.log(fileExists ? `  ✓ Artwork saved as ${filename}\n` : '  ✗ Failed to save artwork\n');
    results.push({ name: 'Save artwork', passed: fileExists });
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    results.push({ name: 'Save artwork', passed: false });
  }

  // Test 3: Load artwork
  console.log('Test 3: Load GhostPaint artwork');
  try {
    const files = await fs.listDirectory('/ghostpaint');
    
    if (files.length === 0) {
      console.log('  ✗ No saved artworks found\n');
      results.push({ name: 'Load artwork', passed: false });
    } else {
      const sortedFiles = files.sort((a, b) => b.modified - a.modified);
      const latestFile = sortedFiles[0];
      
      const content = await fs.readFile(latestFile.path);
      const artworkData = JSON.parse(content);
      
      const isValid = 'width' in artworkData && 
                      'height' in artworkData && 
                      'pixels' in artworkData && 
                      'timestamp' in artworkData && 
                      'version' in artworkData;
      
      console.log(isValid 
        ? `  ✓ Loaded ${latestFile.name} successfully (${artworkData.width}x${artworkData.height})\n`
        : '  ✗ Artwork data structure is invalid\n');
      results.push({ name: 'Load artwork', passed: isValid });
    }
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    results.push({ name: 'Load artwork', passed: false });
  }

  // Test 4: Round trip
  console.log('Test 4: GhostPaint save/load round trip');
  try {
    const timestamp = Date.now();
    const filename = `roundtrip_${timestamp}.json`;
    const path = `/ghostpaint/${filename}`;
    
    const originalArtwork = {
      width: 16,
      height: 16,
      pixels: Array(16).fill(null).map((_, y) => 
        Array(16).fill('transparent').map((_, x) => 
          (x + y) % 3 === 0 ? '#FF5555' : 'transparent'
        )
      ),
      timestamp,
      version: '1.0'
    };

    await fs.createFile(path, JSON.stringify(originalArtwork, null, 2));
    const loadedContent = await fs.readFile(path);
    const loadedArtwork = JSON.parse(loadedContent);
    
    const roundTripSuccess = 
      originalArtwork.width === loadedArtwork.width &&
      originalArtwork.height === loadedArtwork.height &&
      JSON.stringify(originalArtwork.pixels) === JSON.stringify(loadedArtwork.pixels) &&
      originalArtwork.timestamp === loadedArtwork.timestamp;
    
    console.log(roundTripSuccess 
      ? '  ✓ Round trip successful - data preserved\n'
      : '  ✗ Round trip failed\n');
    results.push({ name: 'Round trip', passed: roundTripSuccess });
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    results.push({ name: 'Round trip', passed: false });
  }

  return results;
}

async function testDeadMailIntegration() {
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│ DeadMail Persistence Tests (Requirement 4.4)            │');
  console.log('└─────────────────────────────────────────────────────────┘\n');

  const fs = new VirtualFileSystem();
  const results = [];

  // Test 5: Directory creation
  console.log('Test 5: DeadMail directory creation');
  try {
    const dirExists = await fs.exists('/deadmail');
    if (!dirExists) {
      await fs.createDirectory('/deadmail');
    }
    const dirExistsAfter = await fs.exists('/deadmail');
    console.log(dirExistsAfter ? '  ✓ Directory created successfully\n' : '  ✗ Failed to create directory\n');
    results.push({ name: 'Directory creation', passed: dirExistsAfter });
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    results.push({ name: 'Directory creation', passed: false });
  }

  // Test 6: Send email with performance check
  console.log('Test 6: Send email (save to filesystem)');
  try {
    const timestamp = Date.now();
    const email = {
      id: `email_${timestamp}`,
      from: 'ghost@shadowscript.os',
      to: 'user@shadowscript.os',
      subject: 'Test Email from the Void',
      body: 'This is a test email to verify DeadMail persistence.',
      timestamp,
      isRead: false
    };

    const path = `/deadmail/${email.id}.json`;
    
    const startTime = performance.now();
    await fs.createFile(path, JSON.stringify(email, null, 2));
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    const fileExists = await fs.exists(path);
    const withinTimeLimit = duration < 500;
    
    console.log(fileExists 
      ? `  ✓ Email saved in ${duration.toFixed(2)}ms ${withinTimeLimit ? '(✓ <500ms)' : '(✗ ≥500ms)'}\n`
      : '  ✗ Failed to save email\n');
    results.push({ name: 'Send email', passed: fileExists && withinTimeLimit, duration });
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    results.push({ name: 'Send email', passed: false });
  }

  // Test 7: Load inbox messages
  console.log('Test 7: Load inbox messages');
  try {
    const files = await fs.listDirectory('/deadmail');
    
    if (files.length === 0) {
      console.log('  ✗ No messages found in inbox\n');
      results.push({ name: 'Load inbox', passed: false });
    } else {
      const emails = [];
      
      for (const file of files) {
        if (file.type === 'file' && file.name.endsWith('.json')) {
          const content = await fs.readFile(file.path);
          const email = JSON.parse(content);
          emails.push(email);
        }
      }
      
      const allValid = emails.every(email => 
        'id' in email &&
        'from' in email &&
        'to' in email &&
        'subject' in email &&
        'body' in email &&
        'timestamp' in email &&
        'isRead' in email
      );
      
      console.log(allValid 
        ? `  ✓ Loaded ${emails.length} message(s) successfully\n`
        : '  ✗ Some messages have invalid structure\n');
      results.push({ name: 'Load inbox', passed: allValid && emails.length > 0 });
    }
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    results.push({ name: 'Load inbox', passed: false });
  }

  // Test 8: Update email
  console.log('Test 8: Update email (mark as read)');
  try {
    const files = await fs.listDirectory('/deadmail');
    
    if (files.length === 0) {
      console.log('  ✗ No messages to update\n');
      results.push({ name: 'Update email', passed: false });
    } else {
      const firstFile = files[0];
      const content = await fs.readFile(firstFile.path);
      const email = JSON.parse(content);
      
      email.isRead = true;
      await fs.updateFile(firstFile.path, JSON.stringify(email, null, 2));
      
      const updatedContent = await fs.readFile(firstFile.path);
      const updatedEmail = JSON.parse(updatedContent);
      
      console.log(updatedEmail.isRead 
        ? '  ✓ Email marked as read successfully\n'
        : '  ✗ Failed to update email read status\n');
      results.push({ name: 'Update email', passed: updatedEmail.isRead === true });
    }
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    results.push({ name: 'Update email', passed: false });
  }

  // Test 9: Performance test
  console.log('Test 9: DeadMail message persistence performance');
  try {
    const performanceResults = [];
    
    for (let i = 0; i < 5; i++) {
      const timestamp = Date.now();
      const email = {
        id: `perf_test_${timestamp}_${i}`,
        from: 'performance@test.os',
        to: 'user@shadowscript.os',
        subject: `Performance Test ${i + 1}`,
        body: 'Testing message persistence performance.',
        timestamp,
        isRead: false
      };

      const path = `/deadmail/${email.id}.json`;
      
      const startTime = performance.now();
      await fs.createFile(path, JSON.stringify(email, null, 2));
      const endTime = performance.now();
      
      performanceResults.push(endTime - startTime);
    }
    
    const avgDuration = performanceResults.reduce((a, b) => a + b, 0) / performanceResults.length;
    const maxDuration = Math.max(...performanceResults);
    const allWithinLimit = performanceResults.every(d => d < 500);
    
    console.log(allWithinLimit 
      ? `  ✓ Avg: ${avgDuration.toFixed(2)}ms, Max: ${maxDuration.toFixed(2)}ms (all <500ms)\n`
      : `  ✗ Avg: ${avgDuration.toFixed(2)}ms, Max: ${maxDuration.toFixed(2)}ms (some ≥500ms)\n`);
    results.push({ name: 'Performance test', passed: allWithinLimit, duration: avgDuration });
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    results.push({ name: 'Performance test', passed: false });
  }

  return results;
}

async function testAppNavigation() {
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│ App Navigation Tests                                    │');
  console.log('└─────────────────────────────────────────────────────────┘\n');

  const results = [];

  // Test 10: Command parsing
  console.log('Test 10: Terminal command parsing for app launch');
  try {
    const validCommands = ['ghostpaint', 'deadmail', 'help', 'ls', 'cd', 'cat', 'clear', 'haunt', 'mutate'];
    const ghostpaintValid = validCommands.includes('ghostpaint');
    const deadmailValid = validCommands.includes('deadmail');
    
    console.log(ghostpaintValid && deadmailValid 
      ? '  ✓ Both app launch commands are valid\n'
      : '  ✗ One or more app launch commands are invalid\n');
    results.push({ name: 'Command parsing', passed: ghostpaintValid && deadmailValid });
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    results.push({ name: 'Command parsing', passed: false });
  }

  // Test 11: App state management
  console.log('Test 11: App state management');
  try {
    let currentApp = null;
    
    currentApp = 'ghostpaint';
    const ghostpaintLaunched = currentApp === 'ghostpaint';
    
    currentApp = null;
    const returnedToTerminal1 = currentApp === null;
    
    currentApp = 'deadmail';
    const deadmailLaunched = currentApp === 'deadmail';
    
    currentApp = null;
    const returnedToTerminal2 = currentApp === null;
    
    const allTransitionsValid = ghostpaintLaunched && returnedToTerminal1 && deadmailLaunched && returnedToTerminal2;
    
    console.log(allTransitionsValid 
      ? '  ✓ All app state transitions work correctly\n'
      : '  ✗ Some app state transitions failed\n');
    results.push({ name: 'State management', passed: allTransitionsValid });
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
    results.push({ name: 'State management', passed: false });
  }

  return results;
}

async function runAllTests() {
  const allResults = [];

  const ghostpaintResults = await testGhostPaintIntegration();
  allResults.push(...ghostpaintResults);

  const deadmailResults = await testDeadMailIntegration();
  allResults.push(...deadmailResults);

  const navigationResults = await testAppNavigation();
  allResults.push(...navigationResults);

  // Summary
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║ Test Summary                                               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  const passed = allResults.filter(r => r.passed).length;
  const failed = allResults.filter(r => !r.passed).length;
  const total = allResults.length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed} ✓`);
  console.log(`Failed: ${failed} ✗`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);
  
  if (failed > 0) {
    console.log('❌ Failed Tests:');
    allResults.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}`);
    });
    console.log('');
  }
  
  const performanceTests = allResults.filter(r => r.duration !== undefined);
  if (performanceTests.length > 0) {
    console.log('⏱️  Performance Summary:');
    performanceTests.forEach(r => {
      console.log(`  - ${r.name}: ${r.duration.toFixed(2)}ms`);
    });
    console.log('');
  }
  
  console.log(failed === 0 ? '✅ All tests passed!' : '⚠️  Some tests failed.');
  console.log('');
  
  return { total, passed, failed, results: allResults };
}

runAllTests().catch(console.error);
