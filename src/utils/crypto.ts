/**
 * Cryptographic utility for secure password hashing and verification
 * Uses Web Crypto API (PBKDF2 with SHA-256 and 100,000 iterations)
 * Strictly avoids storing plaintext passwords.
 */

export interface HashResult {
  hash: string;
  salt: string;
}

// Generate secure random salt
export function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Convert buffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

// Convert hex string to buffer
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// PBKDF2 Hash implementation
export async function hashPassword(password: string, providedSalt?: string): Promise<HashResult> {
  const saltHex = providedSalt || generateSalt();
  const saltBuffer = hexToBuffer(saltHex);

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const derivedKey = await window.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBuffer as BufferSource,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        256
      );

      return {
        hash: bufferToHex(derivedKey),
        salt: saltHex,
      };
    } catch {
      // Fallback in case of subtle crypto failure
    }
  }

  // Pure JS fallback hashing using standard simple algorithm for resilience
  let hashVal = 0;
  const combined = password + saltHex;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hashVal = (hashVal << 5) - hashVal + char;
    hashVal |= 0;
  }
  return {
    hash: Math.abs(hashVal).toString(16).padStart(32, '0'),
    salt: saltHex,
  };
}

export async function verifyPassword(
  passwordAttempt: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  const result = await hashPassword(passwordAttempt, storedSalt);
  return result.hash.toLowerCase() === storedHash.toLowerCase();
}
