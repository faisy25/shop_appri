import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateInteger,
  validateNumberRange,
} from '../../../utils/validation/commonValidation';

/**
 * Validates feature name (required, min 2, max 200)
 * @param {string} value - Feature name
 * @returns {string|true} - Error message or true if valid
 */
export const validateFeatureName = (value) => {
  const required = validateRequired(value, 'Feature Name');
  if (required !== true) return required;

  const minLength = validateMinLength(value, 2, 'Feature Name');
  if (minLength !== true) return minLength;

  const maxLength = validateMaxLength(value, 200, 'Feature Name');
  if (maxLength !== true) return maxLength;

  return true;
};

/**
 * Validates FK ID (optional, integer)
 * @param {number} value - FK ID
 * @returns {string|true} - Error message or true if valid
 */
export const validateFkId = (value) => {
  if (value === null || value === undefined || value === '' || value === 0) return true; // Optional field

  return validateInteger(value, 'FK ID');
};

/**
 * Validates sort order (optional, range 0-9999)
 * @param {number} value - Sort order
 * @returns {string|true} - Error message or true if valid
 */
export const validateSortOrder = (value) => {
  if (value === null || value === undefined || value === '' || value === 0) return true; // Optional field

  return validateNumberRange(value, 0, 9999, 'Sort Order');
};
