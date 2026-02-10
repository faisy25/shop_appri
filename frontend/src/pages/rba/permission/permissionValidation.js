import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateExactLength,
} from '../../../utils/validation/commonValidation';

/**
 * Validates permission ID (required, exactly 10 characters)
 * @param {string} value - Permission ID
 * @returns {string|true} - Error message or true if valid
 */
export const validatePermissionId = (value) => {
  const required = validateRequired(value, 'Permission ID');
  if (required !== true) return required;

  return validateExactLength(value, 10, 'Permission ID');
};

/**
 * Validates permission name (required, min 2, max 200)
 * @param {string} value - Permission name
 * @returns {string|true} - Error message or true if valid
 */
export const validatePermissionName = (value) => {
  const required = validateRequired(value, 'Permission Name');
  if (required !== true) return required;

  const minLength = validateMinLength(value, 2, 'Permission Name');
  if (minLength !== true) return minLength;

  const maxLength = validateMaxLength(value, 200, 'Permission Name');
  if (maxLength !== true) return maxLength;

  return true;
};
