/**
 * Input helper functions for form fields
 */

/**
 * Prevents non-integer input in number fields
 * Blocks: decimal points, +/- signs, and 'e' (scientific notation)
 * Use with onKeyDown event on number inputs
 *
 * @param {KeyboardEvent} e - Keyboard event
 *
 * @example
 * <input
 *   type="number"
 *   onKeyDown={handleInputWholeNumber}
 * />
 */
export const handleInputWholeNumber = (e) => {
  // List of keys that should be blocked for whole number input
  const invalidChars = ['.', 'e', 'E', '+', '-'];

  // Block the keypress if it's one of the invalid characters
  if (invalidChars.includes(e.key)) {
    e.preventDefault();
  }
};

/**
 * Prevents negative numbers in number fields
 * Blocks: minus sign
 * Use with onKeyDown event on number inputs
 *
 * @param {KeyboardEvent} e - Keyboard event
 *
 * @example
 * <input
 *   type="number"
 *   onKeyDown={handleInputPositiveNumber}
 * />
 */
export const handleInputPositiveNumber = (e) => {
  // Block minus sign
  if (e.key === '-') {
    e.preventDefault();
  }
};

/**
 * Formats a number with thousands separators
 *
 * @param {number|string} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 *
 * @example
 * formatNumberWithCommas(1234.56) // "1,234.56"
 * formatNumberWithCommas(1234567, 0) // "1,234,567"
 */
export const formatNumberWithCommas = (value, decimals = 2) => {
  if (!value && value !== 0) return '';

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '';

  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Parses a formatted number string back to a number
 * Removes commas and other formatting
 *
 * @param {string} value - The formatted number string
 * @returns {number|null} Parsed number or null if invalid
 *
 * @example
 * parseFormattedNumber("1,234.56") // 1234.56
 * parseFormattedNumber("$1,234.56") // 1234.56
 */
export const parseFormattedNumber = (value) => {
  if (!value && value !== 0) return null;

  // Remove all non-numeric characters except decimal point and minus sign
  const cleaned = String(value).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);

  return isNaN(num) ? null : num;
};

export default handleInputWholeNumber;
