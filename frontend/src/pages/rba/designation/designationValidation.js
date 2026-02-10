import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateExactLength,
} from '../../../utils/validation/commonValidation';

/**
 * Validates designation ID (required, exactly 10 characters)
 * @param {string} value - Designation ID
 * @returns {string|true} - Error message or true if valid
 */
export const validateDesignationId = (value) => {
  const required = validateRequired(value, 'Designation ID');
  if (required !== true) return required;

  return validateExactLength(value, 10, 'Designation ID');
};

/**
 * Validates designation name (required, min 2, max 200)
 * @param {string} value - Designation name
 * @returns {string|true} - Error message or true if valid
 */
export const validateDesignationName = (value) => {
  const required = validateRequired(value, 'Designation Name');
  if (required !== true) return required;

  const minLength = validateMinLength(value, 2, 'Designation Name');
  if (minLength !== true) return minLength;

  const maxLength = validateMaxLength(value, 200, 'Designation Name');
  if (maxLength !== true) return maxLength;

  return true;
};
