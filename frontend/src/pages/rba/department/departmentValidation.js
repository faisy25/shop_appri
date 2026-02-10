import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateExactLength,
} from '../../../utils/validation/commonValidation';

/**
 * Validates department ID (required, exactly 10 characters)
 * @param {string} value - Department ID
 * @returns {string|true} - Error message or true if valid
 */
export const validateDepartmentId = (value) => {
  const required = validateRequired(value, 'Department ID');
  if (required !== true) return required;

  return validateExactLength(value, 10, 'Department ID');
};

/**
 * Validates department name (required, min 2, max 200)
 * @param {string} value - Department name
 * @returns {string|true} - Error message or true if valid
 */
export const validateDepartmentName = (value) => {
  const required = validateRequired(value, 'Department Name');
  if (required !== true) return required;

  const minLength = validateMinLength(value, 2, 'Department Name');
  if (minLength !== true) return minLength;

  const maxLength = validateMaxLength(value, 200, 'Department Name');
  if (maxLength !== true) return maxLength;

  return true;
};
