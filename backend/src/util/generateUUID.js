import { randomBytes, randomUUID } from 'crypto';
/**
 * Generate UUID
 * Uses Node.js built-in randomUUID if available (Node 14.17.0+)
 * Falls back to generating UUID-like string using randomBytes
 * @returns {string} - UUID v4 format string
 */
export const generateUUID = () => {
  try {
    // Use Node.js built-in randomUUID if available (Node 14.17.0+)
    return randomUUID();
  } catch (err) {
    // Fallback: generate UUID-like string using randomBytes
    const bytes = randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
    return [
      bytes.toString('hex', 0, 4),
      bytes.toString('hex', 4, 6),
      bytes.toString('hex', 6, 8),
      bytes.toString('hex', 8, 10),
      bytes.toString('hex', 10, 16),
    ].join('-');
  }
};
