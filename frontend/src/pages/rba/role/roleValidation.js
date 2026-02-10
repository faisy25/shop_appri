import { validateMaxLength } from '../../../utils/validation/commonValidation';

/**
 * Validates role description (optional, max 100)
 * @param {string} value - Role description
 * @returns {string|true} - Error message or true if valid
 */
export const validateRoleDescription = (value) => {
  if (!value) return true; // Optional field

  return validateMaxLength(value, 100, 'Description');
};
