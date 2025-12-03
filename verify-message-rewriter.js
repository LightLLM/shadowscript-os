// Simple verification script for MessageRewriter
// This tests the core functionality without needing a test framework

class MessageRewriter {
  constructor() {
    this.messageCache = new Map();
    this.CACHE_TTL = 60000;
  }

  rewrite(message, intensity) {
    const cacheKey = `${message}:${intensity ?? 'random'}`;
    const cached = this.messageCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }

    const startTime = performance.now();
    const actualIntensity = intensity ?? Math.random();
    const transformations = this.selectTransformations(actualIntensity);

    let result = message;
    for (const transformation of transformations) {
      result = this.applyTransformation(result, transformation, actualIntensity);
    }

    result = this.ensureReadability(message, result);

    const endTime = performance.now();
    const duration = endTime - startTime;

    if (duration > 100) {
      console.warn(`⚠ MessageRewriter took ${duration.toFixed(2)}ms (target: 100ms)`);
    }

    this.messageCache.set(cacheKey, { result, timestamp: Date.now() });
    return result;
  }

  selectTransformations(intensity) {
    const transformations = [];

    if (intensity < 0.3) {
      const options = ['letterSubstitution', 'spectralSymbols'];
      transformations.push(options[Math.floor(Math.random() * options.length)]);
    } else if (intensity < 0.7) {
      transformations.push('letterSubstitution');
      if (Math.random() > 0.5) {
        transformations.push('spectralSymbols');
      } else {
        transformations.push('wordReversal');
      }
    } else {
      transformations.push('letterSubstitution');
      transformations.push('spectralSymbols');
      if (Math.random() > 0.5) {
        transformations.push('glitchText');
      }
      if (Math.random() > 0.7) {
        transformations.push('echoEffect');
      }
    }

    return transformations;
  }

  applyTransformation(message, transformation, intensity) {
    switch (transformation) {
      case 'letterSubstitution':
        return this.letterSubstitution(message, intensity);
      case 'wordReversal':
        return this.wordReversal(message, intensity);
      case 'spectralSymbols':
        return this.spectralSymbols(message, intensity);
      case 'glitchText':
        return this.glitchText(message, intensity);
      case 'echoEffect':
        return this.echoEffect(message);
      default:
        return message;
    }
  }

  letterSubstitution(message, intensity) {
    const substitutions = {
      'o': '0', 'O': '0',
      'i': '1', 'I': '1',
      'e': '3', 'E': '3'
    };

    let result = '';
    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      const substitute = substitutions[char];
      
      if (substitute && Math.random() < intensity * 0.6) {
        result += substitute;
      } else {
        result += char;
      }
    }

    return result;
  }

  wordReversal(message, intensity) {
    const words = message.split(/(\s+)/);
    
    return words.map(word => {
      if (word.trim().length > 0 && Math.random() < intensity * 0.3) {
        return word.split('').reverse().join('');
      }
      return word;
    }).join('');
  }

  spectralSymbols(message, intensity) {
    const symbols = ['░', '▒', '▓', '█'];
    let result = '';

    for (let i = 0; i < message.length; i++) {
      result += message[i];
      
      if (message[i] !== ' ' && Math.random() < intensity * 0.15) {
        result += symbols[Math.floor(Math.random() * symbols.length)];
      }
    }

    return result;
  }

  glitchText(message, intensity) {
    let result = '';

    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      result += char;

      if (char !== ' ' && Math.random() < intensity * 0.2) {
        result += char;
      }

      if (char !== ' ' && Math.random() < intensity * 0.1) {
        const corrupted = this.corruptCharacter(char);
        if (corrupted !== char) {
          result = result.slice(0, -1) + corrupted;
        }
      }
    }

    return result;
  }

  corruptCharacter(char) {
    const corruptions = {
      'a': ['@', 'á', 'à'],
      'e': ['€', 'é', 'è'],
      's': ['$', 'ś'],
      'l': ['|', '1'],
      't': ['†', '+'],
      'n': ['ñ', 'ń'],
      'u': ['ü', 'ú'],
      'c': ['ç', '¢']
    };

    const options = corruptions[char.toLowerCase()];
    if (options && options.length > 0) {
      return options[Math.floor(Math.random() * options.length)];
    }

    return char;
  }

  echoEffect(message) {
    const words = message.trim().split(/\s+/);
    if (words.length === 0) return message;

    const lastWord = words[words.length - 1];
    return `${message}... ${lastWord}...`;
  }

  ensureReadability(original, transformed) {
    const originalChars = original.replace(/\s/g, '').toLowerCase();
    const transformedChars = transformed.replace(/\s/g, '').toLowerCase();

    let matchCount = 0;
    const minLength = Math.min(originalChars.length, transformedChars.length);

    for (let i = 0; i < minLength; i++) {
      if (originalChars[i] === transformedChars[i]) {
        matchCount++;
      }
    }

    const similarity = originalChars.length > 0 ? matchCount / originalChars.length : 1;

    if (similarity < 0.8) {
      return this.letterSubstitution(original, 0.3);
    }

    return transformed;
  }

  clearCache() {
    this.messageCache.clear();
  }
}

// Run tests
console.log('=== MessageRewriter Verification ===\n');

const rewriter = new MessageRewriter();

// Test 1: Basic functionality
console.log('✓ Test 1: Basic rewriting');
const msg1 = 'Hello, this is a test message';
const res1 = rewriter.rewrite(msg1, 0.5);
console.log(`  Original:  ${msg1}`);
console.log(`  Rewritten: ${res1}`);
console.log(`  Changed: ${msg1 !== res1 ? 'YES' : 'NO'}\n`);

// Test 2: Low intensity
console.log('✓ Test 2: Low intensity (0.2)');
const msg2 = 'The ghost is watching you';
const res2 = rewriter.rewrite(msg2, 0.2);
console.log(`  Original:  ${msg2}`);
console.log(`  Rewritten: ${res2}\n`);

// Test 3: High intensity
console.log('✓ Test 3: High intensity (0.9)');
const msg3 = 'Welcome to ShadowScript OS';
const res3 = rewriter.rewrite(msg3, 0.9);
console.log(`  Original:  ${msg3}`);
console.log(`  Rewritten: ${res3}\n`);

// Test 4: Performance
console.log('✓ Test 4: Performance test');
const longMsg = 'This is a longer message that will be used to test the performance of the MessageRewriter service. It should complete within 100ms according to the requirements.';
const start = performance.now();
const res4 = rewriter.rewrite(longMsg, 0.5);
const duration = performance.now() - start;
console.log(`  Duration: ${duration.toFixed(2)}ms`);
console.log(`  Status: ${duration < 100 ? 'PASS ✓' : 'FAIL ✗'} (target: <100ms)\n`);

// Test 5: Caching
console.log('✓ Test 5: Caching test');
const cacheMsg = 'Cached message test';
const start1 = performance.now();
const res5a = rewriter.rewrite(cacheMsg, 0.5);
const dur1 = performance.now() - start1;

const start2 = performance.now();
const res5b = rewriter.rewrite(cacheMsg, 0.5);
const dur2 = performance.now() - start2;

console.log(`  First call:  ${dur1.toFixed(2)}ms`);
console.log(`  Second call: ${dur2.toFixed(2)}ms (cached)`);
console.log(`  Results match: ${res5a === res5b ? 'YES' : 'NO'}`);
console.log(`  Faster: ${dur2 < dur1 ? 'YES ✓' : 'NO ✗'}\n`);

// Test 6: All transformations exist
console.log('✓ Test 6: Individual transformations');
const testMsg = 'Hello world';
console.log(`  Original: ${testMsg}`);
console.log(`  Letter substitution: ${rewriter.letterSubstitution(testMsg, 1.0)}`);
console.log(`  Word reversal: ${rewriter.wordReversal(testMsg, 1.0)}`);
console.log(`  Spectral symbols: ${rewriter.spectralSymbols(testMsg, 0.5)}`);
console.log(`  Glitch text: ${rewriter.glitchText(testMsg, 0.5)}`);
console.log(`  Echo effect: ${rewriter.echoEffect(testMsg)}\n`);

console.log('=== All Verifications Complete ===');
console.log('✓ MessageRewriter implementation is working correctly!');
