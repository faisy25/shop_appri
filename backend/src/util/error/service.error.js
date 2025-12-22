import ApiError from './api.error.js';

export const ServiceError = (err, fallbackMessage = 'Server error') => {
  // If it is already your custom API error → return directly
  if (err instanceof ApiError) {
    throw err;
  }

  // Otherwise wrap into an ApiError
  throw new ApiError(err.statusCode || 500, fallbackMessage, err.message);
};
