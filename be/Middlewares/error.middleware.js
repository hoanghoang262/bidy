const { response } = require('../util/response');
const { responseStatus, transValidation } = require('../langs/vn');
const logger = require('../util/logger');

/**
 * Error handling middleware - must be last middleware in the chain
 */
const errorHandler = (err, req, res, _next) => {
  // Default error values
  let statusCode = 500;
  let message = transValidation.internal_error || 'Internal Server Error';

  // Log error for debugging
  logger.error('Error occurred', err, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(error => error.message).join(', ');
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Custom operational errors
  if (err.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Rate limit error
  if (err.type === 'rate_limit_error') {
    statusCode = 429;
    message = 'Too many requests';
  }

  // Multer upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File size too large';
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    statusCode = 400;
    message = 'Too many files';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field';
  }

  // Send error response
  res.status(statusCode).json(
    response(responseStatus.fail, message, process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      error: err.message,
    } : undefined),
  );
};

/**
 * 404 Not Found middleware
 */
const notFoundHandler = (req, res, _next) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.status(404).json(
    response(responseStatus.fail, message),
  );
};

/**
 * Async error wrapper - catches async errors and passes to error handler
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Operational Error class for custom business logic errors
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
};