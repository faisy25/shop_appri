export default class ApiError extends Error {
  constructor(statusCode, message, internalMessage = null, extra = {}) {
    super(message);
    this.statusCode = statusCode;
    this.internalMessage = internalMessage || message;
    this.extra = extra;
    this.isOperational = true;
  }
}
