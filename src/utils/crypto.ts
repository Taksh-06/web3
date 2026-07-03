/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Computes the SHA-256 hash of a string using the browser's Web Crypto API.
 */
export async function calculateSha256(message: string): Promise<string> {
  try {
    if (window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }
  } catch (error) {
    console.warn("Web Crypto API failed, falling back to basic hash", error);
  }

  // Fallback simple hash (not cryptographically secure, but guarantees simulator works)
  return mockSha256Fallback(message);
}

/**
 * Simple deterministic 64-character hash generator fallback in case Web Crypto is unavailable.
 */
function mockSha256Fallback(str: string): string {
  let hash1 = 5381;
  let hash2 = 137;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) + char;
    hash2 = ((hash2 << 5) + hash2) ^ char;
  }
  
  const part1 = Math.abs(hash1).toString(16).padStart(8, '0');
  const part2 = Math.abs(hash2).toString(16).padStart(8, '0');
  const part3 = Math.abs(hash1 ^ hash2).toString(16).padStart(8, '0');
  const part4 = Math.abs(hash1 * hash2 || 9999).toString(16).padStart(8, '0');
  
  const raw = part1 + part2 + part3 + part4 + part1 + part2 + part3 + part4;
  return raw.substring(0, 64);
}
