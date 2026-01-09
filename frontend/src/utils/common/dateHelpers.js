/**
 * Date utility functions for common date operations
 */

/**
 * Converts date value from Redux (ISO string) to Date object for form inputs
 * Handles Date objects, ISO strings, and null/undefined values
 * @param {Date|string|null|undefined} dateValue - Date value from Redux or API
 * @returns {Date|null} - Date object or null if invalid/missing
 */
export const parseDateFromRedux = (dateValue) => {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === 'string') {
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
};

/**
 * Converts Date object to ISO string for Redux storage (serializable)
 * @param {Date|string|null|undefined} dateValue - Date object or ISO string
 * @returns {string|null} - ISO string or null
 */
export const serializeDateForRedux = (dateValue) => {
  if (!dateValue) return null;
  if (dateValue instanceof Date) {
    return isNaN(dateValue.getTime()) ? null : dateValue.toISOString();
  }
  if (typeof dateValue === 'string') {
    // Validate it's a valid date string
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : dateValue;
  }
  return null;
};

/**
 * Converts Date object to YYYY-MM-DD format for API submission
 * @param {Date|string|null|undefined} dateValue - Date object or ISO string
 * @returns {string|null} - YYYY-MM-DD string or null
 */
export const formatDateForAPI = (dateValue) => {
  if (!dateValue) return null;

  let date;
  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  } else {
    return null;
  }

  if (isNaN(date.getTime())) return null;

  // Format as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Converts Date object to ISO string (full datetime)
 * @param {Date|string|null|undefined} dateValue - Date object or ISO string
 * @returns {string|null} - ISO string or null
 */
export const formatDateToISO = (dateValue) => {
  if (!dateValue) return null;

  let date;
  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  } else {
    return null;
  }

  if (isNaN(date.getTime())) return null;

  return date.toISOString();
};

/**
 * Validates if a value is a valid date
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid date, false otherwise
 */
export const isValidDate = (value) => {
  if (!value) return false;
  if (value instanceof Date) return !isNaN(value.getTime());
  if (typeof value === 'string') {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  return false;
};

/**
 * Gets current date in YYYY-MM-DD format
 * @returns {string} - Current date as YYYY-MM-DD
 */
export const getCurrentDateString = () => {
  const today = new Date();
  return formatDateForAPI(today);
};

/**
 * Gets current year
 * @returns {number} - Current year
 */
export const getCurrentYear = () => {
  return new Date().getFullYear();
};
