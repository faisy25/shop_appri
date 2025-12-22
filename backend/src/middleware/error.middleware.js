import logger from '../config/logger.js';
import ApiError from '../util/error/api.error.js';

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  logger.error({
    status,
    message: err.internalMessage || err.message,
    extra: err.extra,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  if (err instanceof ApiError) {
    return res.status(status).json({
      status: false,
      statusCode: status,
      message: err.message,
      ...(err.extra && { extra: err.extra }),
    });
  }

  return res.status(status).json({
    status: false,
    statusCode: status,
    message: err.message || 'Internal Server Error',
  });
};
