export type Transformation =
  | 'letterSubstitution'
  | 'wordReversal'
  | 'spectralSymbols'
  | 'glitchText'
  | 'echoEffect';

export class MessageRewriter {
  private messageCache: Map<string, { result: string; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 60000; // 1 minute
  private readonly MAX_CACHE_SIZE = 100; // Prevent memory leaks
  
  // Pre-compiled patterns for better performance
  private readonly WORD_SPLIT_PATTERN = /(\s+)/;
  
  // Pre-defined substitution maps for faster lookups
  private readonly LETTER_SUBSTITUTIONS: Record<string, string> = {
    'o': '0', 'O': '0',
    'i': '1', 'I': '1',
    'e': '3', 'E': '3'
  };
  
  private readonly SPECTRAL_SYMBOLS = ['░', '▒', '▓', '█'];
  
  private readonly CHARACTER_CORRUPTIONS: Record<string, string[]> = {
    'a': ['@', 'á', 'à'],
    'e': ['€', 'é', 'è'],
    's': ['$', 'ś'],
    'l': ['|', '1'],
    't': ['†', '+'],
    'n': ['ñ', 'ń'],
    'u': ['ü', 'ú'],
    'c': ['ç', '¢']
  }

  /**
   * Rewrite a message with haunted transformations
   * @param message - The original message to transform
   * @param intensity - Transformation intensity (0-1), defaults to random
   * @returns The transformed message
   */
  rewrite(message: string, intensity?: number): string {
    // Check cache first (memoization for repeated messages)
    const cacheKey = `${message}:${intensity ?? 'random'}`;
    const cached = this.messageCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }

    const startTime = performance.now();

    // Determine intensity if not provided
    const actualIntensity = intensity ?? Math.random();

    // Select transformations based on intensity
    const transformations = this.selectTransformations(actualIntensity);

    // Apply transformations sequentially
    let result = message;
    for (const transformation of transformations) {
      result = this.applyTransformation(result, transformation, actualIntensity);
    }

    // Ensure minimum readability (80%)
    result = this.ensureReadability(message, result);

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Log warning if transformation took too long
    if (duration > 100) {
      console.warn(`MessageRewriter took ${duration.toFixed(2)}ms (target: 100ms)`);
    }

    // Cache the result with automatic cleanup
    this.cacheResult(cacheKey, result);

    return result;
  }
  
  /**
   * Cache a result with automatic size management
   */
  private cacheResult(key: string, result: string): void {
    // Clean up old entries if cache is too large
    if (this.messageCache.size >= this.MAX_CACHE_SIZE) {
      const now = Date.now();
      const entriesToDelete: string[] = [];
      
      // Remove expired entries first
      for (const [cacheKey, value] of this.messageCache.entries()) {
        if (now - value.timestamp >= this.CACHE_TTL) {
          entriesToDelete.push(cacheKey);
        }
      }
      
      // If still too large, remove oldest entries
      if (this.messageCache.size - entriesToDelete.length >= this.MAX_CACHE_SIZE) {
        const entries = Array.from(this.messageCache.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp);
        const toRemove = entries.slice(0, Math.floor(this.MAX_CACHE_SIZE / 2));
        entriesToDelete.push(...toRemove.map(e => e[0]));
      }
      
      entriesToDelete.forEach(k => this.messageCache.delete(k));
    }
    
    this.messageCache.set(key, {
      result,
      timestamp: Date.now()
    });
  }

  /**
   * Select which transformations to apply based on intensity
   */
  private selectTransformations(intensity: number): Transformation[] {
    const transformations: Transformation[] = [];

    if (intensity < 0.3) {
      // Subtle: 1-2 transformations
      const options: Transformation[] = ['letterSubstitution', 'spectralSymbols'];
      transformations.push(options[Math.floor(Math.random() * options.length)]);
    } else if (intensity < 0.7) {
      // Moderate: 2-3 transformations
      transformations.push('letterSubstitution');
      if (Math.random() > 0.5) {
        transformations.push('spectralSymbols');
      } else {
        transformations.push('wordReversal');
      }
    } else {
      // Extreme: 3-4 transformations
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

  /**
   * Apply a specific transformation to the message
   */
  private applyTransformation(
    message: string,
    transformation: Transformation,
    intensity: number
  ): string {
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

  /**
   * Letter substitution: o→0, i→1, e→3
   * Optimized with pre-compiled substitution map and array building
   */
  private letterSubstitution(message: string, intensity: number): string {
    const threshold = intensity * 0.6;
    const chars: string[] = [];
    
    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      const substitute = this.LETTER_SUBSTITUTIONS[char];
      
      // Apply substitution based on intensity
      if (substitute && Math.random() < threshold) {
        chars.push(substitute);
      } else {
        chars.push(char);
      }
    }

    return chars.join('');
  }

  /**
   * Word reversal: reverse random words
   * Optimized with pre-compiled regex pattern
   */
  private wordReversal(message: string, intensity: number): string {
    const words = message.split(this.WORD_SPLIT_PATTERN); // Split but keep whitespace
    const threshold = intensity * 0.3;
    
    return words.map(word => {
      // Only reverse actual words (not whitespace)
      if (word.trim().length > 0 && Math.random() < threshold) {
        return word.split('').reverse().join('');
      }
      return word;
    }).join('');
  }

  /**
   * Spectral symbols: insert ░▒▓█ characters
   * Optimized with pre-defined symbols array and array building
   */
  private spectralSymbols(message: string, intensity: number): string {
    const threshold = intensity * 0.15;
    const chars: string[] = [];
    const symbolCount = this.SPECTRAL_SYMBOLS.length;

    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      chars.push(char);
      
      // Insert spectral symbol after character based on intensity
      if (char !== ' ' && Math.random() < threshold) {
        chars.push(this.SPECTRAL_SYMBOLS[Math.floor(Math.random() * symbolCount)]);
      }
    }

    return chars.join('');
  }

  /**
   * Glitch text: duplicate or corrupt characters
   * Optimized with array building and pre-calculated thresholds
   */
  private glitchText(message: string, intensity: number): string {
    const chars: string[] = [];
    const duplicateThreshold = intensity * 0.2;
    const corruptThreshold = intensity * 0.1;

    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      let currentChar = char;

      // Corrupt character (replace with similar-looking character)
      if (char !== ' ' && Math.random() < corruptThreshold) {
        const corrupted = this.corruptCharacter(char);
        if (corrupted !== char) {
          currentChar = corrupted;
        }
      }

      chars.push(currentChar);

      // Duplicate character based on intensity
      if (char !== ' ' && Math.random() < duplicateThreshold) {
        chars.push(currentChar);
      }
    }

    return chars.join('');
  }

  /**
   * Corrupt a character with a similar-looking one
   * Optimized with pre-defined corruption map
   */
  private corruptCharacter(char: string): string {
    const options = this.CHARACTER_CORRUPTIONS[char.toLowerCase()];
    if (options && options.length > 0) {
      return options[Math.floor(Math.random() * options.length)];
    }

    return char;
  }

  /**
   * Echo effect: repeat the last word
   */
  private echoEffect(message: string): string {
    const words = message.trim().split(/\s+/);
    if (words.length === 0) return message;

    const lastWord = words[words.length - 1];
    return `${message}... ${lastWord}...`;
  }

  /**
   * Ensure the transformed message maintains minimum readability
   * Optimized with early exit and efficient string comparison
   */
  private ensureReadability(original: string, transformed: string): string {
    // Quick check: if strings are very similar in length, likely readable
    const lengthRatio = Math.min(original.length, transformed.length) / 
                       Math.max(original.length, transformed.length);
    
    if (lengthRatio < 0.7) {
      // Too much length difference, apply minimal transformation
      return this.letterSubstitution(original, 0.3);
    }

    // Calculate similarity (optimized character-based approach)
    const originalChars = original.replace(/\s/g, '').toLowerCase();
    const transformedChars = transformed.replace(/\s/g, '').toLowerCase();

    if (originalChars.length === 0) return transformed;

    let matchCount = 0;
    const minLength = Math.min(originalChars.length, transformedChars.length);

    for (let i = 0; i < minLength; i++) {
      if (originalChars[i] === transformedChars[i]) {
        matchCount++;
      }
    }

    const similarity = matchCount / originalChars.length;

    // If readability is below 80%, return a less transformed version
    if (similarity < 0.8) {
      // Apply only letter substitution with lower intensity
      return this.letterSubstitution(original, 0.3);
    }

    return transformed;
  }

  /**
   * Clear the message cache
   */
  clearCache(): void {
    this.messageCache.clear();
  }
}
