import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePositiveNumber,
  validateNumberRange,
} from '../../utils/validation/commonValidation';

/**
 * Validates product name (required, min 2, max 200)
 * @param {string} value - Product name
 * @returns {string|true} - Error message or true if valid
 */
export const validateProductName = (value) => {
  const required = validateRequired(value, 'Product Name');
  if (required !== true) return required;

  const minLength = validateMinLength(value, 2, 'Product Name');
  if (minLength !== true) return minLength;

  const maxLength = validateMaxLength(value, 200, 'Product Name');
  if (maxLength !== true) return maxLength;

  return true;
};

/**
 * Validates product quantity (required, positive number)
 * @param {number} value - Product quantity
 * @returns {string|true} - Error message or true if valid
 */
export const validateQuantity = (value) => {
  const required = validateRequired(value, 'Quantity');
  if (required !== true) return required;

  return validatePositiveNumber(value, 'Quantity');
};

/**
 * Validates product price (required, range 0-999999.99)
 * @param {number} value - Product price
 * @returns {string|true} - Error message or true if valid
 */
export const validatePrice = (value) => {
  const required = validateRequired(value, 'Price');
  if (required !== true) return required;

  return validateNumberRange(value, 0, 999999.99, 'Price');
};
