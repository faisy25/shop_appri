import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
} from '../../../utils/validation/commonValidation';

/**
 * Validates organization name (required, min 2, max 200)
 * @param {string} value - Organization name
 * @returns {string|true} - Error message or true if valid
 */
export const validateOrganizationName = (value) => {
  const required = validateRequired(value, 'Organization Name');
  if (required !== true) return required;

  const minLength = validateMinLength(value, 2, 'Organization Name');
  if (minLength !== true) return minLength;

  const maxLength = validateMaxLength(value, 200, 'Organization Name');
  if (maxLength !== true) return maxLength;

  return true;
};
