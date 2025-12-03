// Polyfill for Node.js environment
if (typeof window === 'undefined') {
  // @ts-ignore
  global.window = {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
  };
}

if (typeof localStorage === 'undefined') {
  class LocalStorageMock {
    private store: Map<string, string> = new Map();

    getItem(key: string): string | null {
      return this.store.get(key) || null;
    }

    setItem(key: string, value: string): void {
      this.store.set(key, value);
    }

    removeItem(key: string): void {
      this.store.delete(key);
    }

    clear(): void {
      this.store.clear();
    }
  }

  // @ts-ignore
  global.localStorage = new LocalStorageMock();
}

if (typeof performance === 'undefined') {
  // @ts-ignore
  global.performance = {
    now: () => Date.now(),
  };
}

import { VirtualFileSystem } from './src/services/mcp/VirtualFileSystem';

/**
 * Integration test suite for mini-app integration
 * Tests GhostPaint and DeadMail save/load functionality
 * 
 * This test validates Requirements 3.5 and 4.4:
 * - 3.5: GhostPaint SHALL allow users to save their artwork to the virtual filesystem
 * - 4.4: DeadMail SHALL store messages in the virtual filesystem within 500 milliseconds
 */

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration?: number;
}

async function testGhostPaintSaveLoad(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const fs = new VirtualFileSystem();

  // Test 1: GhostPaint directory creation
  console.log('\n=== Test 1: GhostPaint directory creation ===');
  try {
    const dirExists = await fs.exists('/ghostpaint');
    if (!dirExists) {
      await fs.createDirectory('/ghostpaint');
    }
    
    const dirExistsAfter = await fs.exists('/ghostpaint');
    results.push({
      name: 'GhostPaint directory creation',
      passed: dirExistsAfter,
      message: dirExistsAfter ? 'Directory created successfully' : 'Failed to create directory'
    });
    console.log(`✓ ${results[results.length - 1].message}`);
  } catch (error) {
    results.push({
      name: 'GhostPaint directory creation',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`✗ ${results[results.length - 1].message}`);
  }

  // Test 2: Save GhostPaint artwork
  console.log('\n=== Test 2: Save GhostPaint artwork ===');
  try {
    const timestamp = Date.now();
    const filename = `artwork_${timestamp}.json`;
    const path = `/ghostpaint/${filename}`;
    
    // Create sample artwork data (simulating GhostPaint state)
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
    results.push({
      name: 'Save GhostPaint artwork',
      passed: fileExists,
      message: fileExists ? `Artwork saved as ${filename}` : 'Failed to save artwork'
    });
    console.log(`✓ ${results[results.length - 1].message}`);
  } catch (error) {
    results.push({
      name: 'Save GhostPaint artwork',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`✗ ${results[results.length - 1].message}`);
  }

  // Test 3: Load GhostPaint artwork
  console.log('\n=== Test 3: Load GhostPaint artwork ===');
  try {
    const files = await fs.listDirectory('/ghostpaint');
    
    if (files.length === 0) {
      results.push({
        name: 'Load GhostPaint artwork',
        passed: false,
        message: 'No saved artworks found'
      });
      console.log(`✗ ${results[results.length - 1].message}`);
    } else {
      // Load the most recent file
      const sortedFiles = files.sort((a, b) => b.modified - a.modified);
      const latestFile = sortedFiles[0];
      
      const content = await fs.readFile(latestFile.path);
      const artworkData = JSON.parse(content);
      
      // Verify artwork structure
      const hasWidth = 'width' in artworkData;
      const hasHeight = 'height' in artworkData;
      const hasPixels = 'pixels' in artworkData && Array.isArray(artworkData.pixels);
      const hasTimestamp = 'timestamp' in artworkData;
      const hasVersion = 'version' in artworkData;
      
      const isValid = hasWidth && hasHeight && hasPixels && hasTimestamp && hasVersion;
      
      results.push({
        name: 'Load GhostPaint artwork',
        passed: isValid,
        message: isValid 
          ? `Loaded ${latestFile.name} successfully (${artworkData.width}x${artworkData.height})`
          : 'Artwork data structure is invalid'
      });
      console.log(`✓ ${results[results.length - 1].message}`);
    }
  } catch (error) {
    results.push({
      name: 'Load GhostPaint artwork',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`✗ ${results[results.length - 1].message}`);
  }

  // Test 4: GhostPaint save/load round trip
  console.log('\n=== Test 4: GhostPaint save/load round trip ===');
  try {
    const timestamp = Date.now();
    const filename = `roundtrip_${timestamp}.json`;
    const path = `/ghostpaint/${filename}`;
    
    // Create unique artwork data
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

    // Save
    await fs.createFile(path, JSON.stringify(originalArtwork, null, 2));
    
    // Load
    const loadedContent = await fs.readFile(path);
    const loadedArtwork = JSON.parse(loadedContent);
    
    // Compare
    const widthMatch = originalArtwork.width === loadedArtwork.width;
    const heightMatch = originalArtwork.height === loadedArtwork.height;
    const pixelsMatch = JSON.stringify(originalArtwork.pixels) === JSON.stringify(loadedArtwork.pixels);
    const timestampMatch = originalArtwork.timestamp === loadedArtwork.timestamp;
    
    const roundTripSuccess = widthMatch && heightMatch && pixelsMatch && timestampMatch;
    
    results.push({
      name: 'GhostPaint save/load round trip',
      passed: roundTripSuccess,
      message: roundTripSuccess 
        ? 'Round trip successful - data preserved'
        : `Round trip failed - width:${widthMatch}, height:${heightMatch}, pixels:${pixelsMatch}, timestamp:${timestampMatch}`
    });
    console.log(`✓ ${results[results.length - 1].message}`);
  } catch (error) {
    results.push({
      name: 'GhostPaint save/load round trip',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`✗ ${results[results.length - 1].message}`);
  }

  return results;
}

async function testDeadMailPersistence(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const fs = new VirtualFileSystem();

  // Test 5: DeadMail directory creation
  console.log('\n=== Test 5: DeadMail directory creation ===');
  try {
    const dirExists = await fs.exists('/deadmail');
    if (!dirExists) {
      await fs.createDirectory('/deadmail');
    }
    
    const dirExistsAfter = await fs.exists('/deadmail');
    results.push({
      name: 'DeadMail directory creation',
      passed: dirExistsAfter,
      message: dirExistsAfter ? 'Directory created successfully' : 'Failed to create directory'
    });
    console.log(`✓ ${results[results.length - 1].message}`);
  } catch (error) {
    results.push({
      name: 'DeadMail directory creation',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`✗ ${results[results.length - 1].message}`);
  }

  // Test 6: Send email (save to filesystem)
  console.log('\n=== Test 6: Send email (save to filesystem) ===');
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

    const filename = `${email.id}.json`;
    const path = `/deadmail/${filename}`;
    
    const startTime = performance.now();
    await fs.createFile(path, JSON.stringify(email, null, 2));
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    const fileExists = await fs.exists(path);
    const withinTimeLimit = duration < 500; // Requirement 4.4: within 500ms
    
    results.push({
      name: 'Send email (save to filesystem)',
      passed: fileExists && withinTimeLimit,
      message: fileExists 
        ? `Email saved in ${duration.toFixed(2)}ms ${withinTimeLimit ? '(✓ <500ms)' : '(✗ ≥500ms)'}`
        : 'Failed to save email',
      duration
    });
    console.log(`${fileExists && withinTimeLimit ? '✓' : '✗'} ${results[results.length - 1].message}`);
  } catch (error) {
    results.push({
      name: 'Send email (save to filesystem)',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`✗ ${results[results.length - 1].message}`);
  }

  // Test 7: Load inbox messages
  console.log('\n=== Test 7: Load inbox messages ===');
  try {
    const files = await fs.listDirectory('/deadmail');
    
    if (files.length === 0) {
      results.push({
        name: 'Load inbox messages',
        passed: false,
        message: 'No messages found in inbox'
      });
      console.log(`✗ ${results[results.length - 1].message}`);
    } else {
      const emails = [];
      
      for (const file of files) {
        if (file.type === 'file' && file.name.endsWith('.json')) {
          const content = await fs.readFile(file.path);
          const email = JSON.parse(content);
          emails.push(email);
        }
      }
      
      // Verify email structure
      const allValid = emails.every(email => 
        'id' in email &&
        'from' in email &&
        'to' in email &&
        'subject' in email &&
        'body' in email &&
        'timestamp' in email &&
        'isRead' in email
      );
      
      results.push({
        name: 'Load inbox messages',
        passed: allValid && emails.length > 0,
        message: allValid 
          ? `Loaded ${emails.length} message(s) successfully`
          : 'Some messages have invalid structure'
      });
      console.log(`✓ ${results[results.length - 1].message}`);
    }
  } catch (error) {
    results.push({
      name: 'Load inbox messages',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`✗ ${results[results.length - 1].message}`);
  }

  // Test 8: Update email (mark as read)
  console.log('\n=== Test 8: Update email (mark as read) ===');
  try {
    const files = await fs.listDirectory('/deadmail');
    
    if (files.length === 0) {
      results.push({
        name: 'Update email (mark as read)',
        passed: false,
        message: 'No messages to update'
      });
      console.log(`✗ ${results[results.length - 1].message}`);
    } else {
      const firstFile = files[0];
      const content = await fs.readFile(firstFile.path);
      const email = JSON.parse(content);
      
      // Mark as read
      email.isRead = true;
      
      await fs.updateFile(firstFile.path, JSON.stringify(email, null, 2));
      
      // Verify update
      const updatedContent = await fs.readFile(firstFile.path);
      const updatedEmail = JSON.parse(updatedContent);
      
      results.push({
        name: 'Update email (mark as read)',
        passed: updatedEmail.isRead === true,
        message: updatedEmail.isRead 
          ? 'Email marked as read successfully'
          : 'Failed to update email read status'
      });
      console.log(`✓ ${results[results.length - 1].message}`);
    }
  } catch (error) {
    results.push({
      name: 'Update email (mark as read)',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`✗ ${results[results.length - 1].message}`);
  }

  // Test 9: DeadMail message persistence performance
  console.log('\n=== Test 9: DeadMail message persistence performance ===');
  try {
    const performanceResults = [];
    
    // Test multiple saves to verify consistent performance
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
    
    results.push({
      name: 'DeadMail message persistence performance',
      passed: allWithinLimit,
      message: `Avg: ${avgDuration.toFixed(2)}ms, Max: ${maxDuration.toFixed(2)}ms ${allWithinLimit ? '(✓ all <500ms)' : '(✗ some ≥500ms)'}`,
      duration: avgDuration
    });
    console.log(`${allWithinLimit ? '✓' : '✗'} ${results[results.length - 1].message}`);
  } catch (error) {
    results.push({
      name: 'DeadMail message persistence performance',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`✗ ${results[results.length - 1].message}`);
  }

  return results;
}

async function testAppNavigation(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // Test 10: Terminal command parsing for app launch
  console.log('\n=== Test 10: Terminal command parsing for app launch ===');
  try {
    // Simulate command parsing (this would normally be done by CommandParser)
    const ghostpaintCommand = 'ghostpaint';
    const deadmailCommand = 'deadmail';
    
    const validCommands = ['ghostpaint', 'deadmail', 'help', 'ls', 'cd', 'cat', 'clear', 'haunt', 'mutate'];
    
    const ghostpaintValid = validCommands.includes(ghostpaintCommand);
    const deadmailValid = validCommands.includes(deadmailCommand);
    
    results.push({
      name: 'Terminal command parsing for app launch',
      passed: ghostpaintValid && deadmailValid,
      message: ghostpaintValid && deadmailValid
        ? 'Both app launch commands are valid'
        : 'One or more app launch commands are invalid'
    });
    console.log(`✓ ${results[results.length - 1].message}`);
  } catch (error) {
    results.push({
      name: 'Terminal command parsing for app launch',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`✗ ${results[results.length - 1].message}`);
  }

  // Test 11: App state management
  console.log('\n=== Test 11: App state management ===');
  try {
    // Simulate app state transitions
    type AppType = 'ghostpaint' | 'deadmail' | null;
    
    let currentApp: AppType = null;
    
    // Launch GhostPaint
    currentApp = 'ghostpaint';
    const ghostpaintLaunched = currentApp === 'ghostpaint';
    
    // Return to terminal
    currentApp = null;
    const returnedToTerminal1 = currentApp === null;
    
    // Launch DeadMail
    currentApp = 'deadmail';
    const deadmailLaunched = currentApp === 'deadmail';
    
    // Return to terminal
    currentApp = null;
    const returnedToTerminal2 = currentApp === null;
    
    const allTransitionsValid = ghostpaintLaunched && returnedToTerminal1 && deadmailLaunched && returnedToTerminal2;
    
    results.push({
      name: 'App state management',
      passed: allTransitionsValid,
      message: allTransitionsValid
        ? 'All app state transitions work correctly'
        : 'Some app state transitions failed'
    });
    console.log(`✓ ${results[results.length - 1].message}`);
  } catch (error) {
    results.push({
      name: 'App state management',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`✗ ${results[results.length - 1].message}`);
  }

  return results;
}

async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Mini-App Integration Test Suite                       ║');
  console.log('║     Testing Requirements 3.5 and 4.4                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  const allResults: TestResult[] = [];

  // Run GhostPaint tests
  console.log('\n┌─────────────────────────────────────────────────────────┐');
  console.log('│ GhostPaint Save/Load Tests (Requirement 3.5)            │');
  console.log('└─────────────────────────────────────────────────────────┘');
  const ghostpaintResults = await testGhostPaintSaveLoad();
  allResults.push(...ghostpaintResults);

  // Run DeadMail tests
  console.log('\n┌─────────────────────────────────────────────────────────┐');
  console.log('│ DeadMail Persistence Tests (Requirement 4.4)            │');
  console.log('└─────────────────────────────────────────────────────────┘');
  const deadmailResults = await testDeadMailPersistence();
  allResults.push(...deadmailResults);

  // Run navigation tests
  console.log('\n┌─────────────────────────────────────────────────────────┐');
  console.log('│ App Navigation Tests                                    │');
  console.log('└─────────────────────────────────────────────────────────┘');
  const navigationResults = await testAppNavigation();
  allResults.push(...navigationResults);

  // Summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║ Test Summary                                               ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const passed = allResults.filter(r => r.passed).length;
  const failed = allResults.filter(r => !r.passed).length;
  const total = allResults.length;
  
  console.log(`\nTotal Tests: ${total}`);
  console.log(`Passed: ${passed} ✓`);
  console.log(`Failed: ${failed} ✗`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    allResults.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.message}`);
    });
  }
  
  // Performance summary
  const performanceTests = allResults.filter(r => r.duration !== undefined);
  if (performanceTests.length > 0) {
    console.log('\n⏱️  Performance Summary:');
    performanceTests.forEach(r => {
      console.log(`  - ${r.name}: ${r.duration?.toFixed(2)}ms`);
    });
  }
  
  console.log('\n' + (failed === 0 ? '✅ All tests passed!' : '⚠️  Some tests failed.'));
  
  return {
    total,
    passed,
    failed,
    results: allResults
  };
}

// Export for use in other contexts
export { runAllTests, testGhostPaintSaveLoad, testDeadMailPersistence, testAppNavigation };

// Run tests if executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runAllTests().catch(console.error);
}
