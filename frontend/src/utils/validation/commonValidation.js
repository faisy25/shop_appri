/**
 * Common validation functions used across all forms
 */

/**
 * Validates required field
 * @param {string} value - Field value
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|true} - Error message or true if valid
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return true;
};

/**
 * Validates minimum length
 * @param {string} value - Field value
 * @param {number} minLength - Minimum length required
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|true} - Error message or true if valid
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value) return true; // Optional field
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return true;
};

/**
 * Validates maximum length
 * @param {string} value - Field value
 * @param {number} maxLength - Maximum length allowed
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|true} - Error message or true if valid
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (!value) return true; // Optional field
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return true;
};

/**
 * Validates exact length
 * @param {string} value - Field value
 * @param {number} length - Exact length required
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|true} - Error message or true if valid
 */
export const validateExactLength = (value, length, fieldName = 'This field') => {
  if (!value) return true; // Optional field
  if (value.length !== length) {
    return `${fieldName} must be exactly ${length} characters`;
  }
  return true;
};

/**
 * Validates email format
 * @param {string} value - Email address
 * @returns {string|true} - Error message or true if valid
 */
export const validateEmail = (value) => {
  if (!value) return 'Email is required';

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return 'Invalid email address';
  }

  return true;
};

/**
 * Validates phone number format
 * @param {string} value - Phone number
 * @returns {string|true} - Error message or true if valid
 */
export const validatePhone = (value) => {
  if (!value) return true; // Optional field

  // Basic phone validation - allows numbers, spaces, dashes, parentheses, plus sign
  const phoneRegex = /^[\d\s\-+()]+$/;
  if (!phoneRegex.test(value)) {
    return 'Invalid phone number format';
  }

  // Remove non-digits and check length
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return 'Phone number must be between 7 and 15 digits';
  }

  return true;
};

/**
 * Validates URL format
 * @param {string} value - URL string
 * @returns {string|true} - Error message or true if valid
 */
export const validateURL = (value) => {
  if (!value) return true; // Optional field

  try {
    new URL(value);
    return true;
  } catch {
    return 'Invalid URL format';
  }
};

/**
 * Validates date of birth - ensures user is at least 18 years old
 * @param {Date|null} value - Date of birth
 * @returns {string|true} - Error message or true if valid
 */
export const validateDateOfBirth = (value) => {
  if (!value) return true; // Optional field

  const today = new Date();
  const birthDate = new Date(value);

  // Check if date is valid
  if (isNaN(birthDate.getTime())) {
    return 'Invalid date';
  }

  // Check if date is not in the future
  if (birthDate > today) {
    return 'Date of birth cannot be in the future';
  }

  // Calculate age
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Check if birthday has occurred this year
  const actualAge =
    monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

  if (actualAge < 18) {
    return 'User must be at least 18 years old';
  }

  return true;
};

/**
 * Validates number range
 * @param {number} value - Number value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|true} - Error message or true if valid
 */
export const validateNumberRange = (value, min, max, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') return true; // Optional field

  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }

  if (min !== undefined && num < min) {
    return `${fieldName} must be at least ${min}`;
  }

  if (max !== undefined && num > max) {
    return `${fieldName} must not exceed ${max}`;
  }

  return true;
};

/**
 * Validates positive number
 * @param {number} value - Number value
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|true} - Error message or true if valid
 */
export const validatePositiveNumber = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') return true; // Optional field

  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }

  if (num < 0) {
    return `${fieldName} must be a positive number`;
  }

  return true;
};

/**
 * Validates integer
 * @param {number} value - Number value
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|true} - Error message or true if valid
 */
export const validateInteger = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') return true; // Optional field

  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num)) {
    return `${fieldName} must be an integer`;
  }

  return true;
};

