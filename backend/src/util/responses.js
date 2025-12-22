export const success = (res, message = 'Success', data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};

export const error = (res, message = 'Failed', extras, statusCode = 500) => {
  return res.status(statusCode).json({
    status: false,
    statusCode,
    message,
    extras: extras,
  });
};
