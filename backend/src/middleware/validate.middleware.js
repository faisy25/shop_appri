// export const validate = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body, { abortEarly: true });

//   if (error) {
//     return next(error); // <- normalizeError handles Joi
//   }

//   next();
// };

import ApiError from '../util/error/api.error.js';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: true });

  if (error) {
    // Convert Joi error → ApiError
    return next(new ApiError(400, error.details[0].message));
  }

  next();
};
