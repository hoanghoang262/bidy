const Joi = require('joi');
const { response } = require('../util/response');
const { responseStatus, transValidation: _transValidation } = require('../langs/vn');

/**
 * Generic validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} target - 'body', 'params', 'query'
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema, target = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[target];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Collect all validation errors
      stripUnknown: true, // Remove unknown properties
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json(
        response(responseStatus.fail, 'Validation Error', { errors: errorDetails }),
      );
    }

    // Replace the original data with sanitized/validated data
    req[target] = value;
    next();
  };
};

// Common validation schemas
const validationSchemas = {
  // User validation schemas
  userLogin: Joi.object({
    userName: Joi.string().alphanum().min(3).max(30).required()
      .messages({
        'string.alphanum': 'Username must only contain alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must not exceed 30 characters',
        'any.required': 'Username is required',
      }),
    password: Joi.string().min(6).max(100).required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password must not exceed 100 characters',
        'any.required': 'Password is required',
      }),
  }),

  userRegister: Joi.object({
    userName: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).max(100).required(),
    fullName: Joi.string().min(2).max(100).required()
      .pattern(/^[a-zA-Z\s\u00C0-\u024F\u1EA0-\u1EF9]+$/)
      .messages({
        'string.pattern.base': 'Full name can only contain letters and spaces',
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
      }),
    identity: Joi.string().pattern(/^\d{9,12}$/).required()
      .messages({
        'string.pattern.base': 'Identity number must be 9-12 digits',
      }),
    phone: Joi.string().pattern(/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/).required()
      .messages({
        'string.pattern.base': 'Please provide a valid Vietnamese phone number',
      }),
  }),

  changePassword: Joi.object({
    old_password: Joi.string().min(6).max(100).required(),
    new_password: Joi.string().min(6).max(100).required()
      .invalid(Joi.ref('old_password'))
      .messages({
        'any.invalid': 'New password must be different from old password',
      }),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).max(100).required(),
  }),

  // Common parameter validation
  mongoIdParam: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
      .messages({
        'string.pattern.base': 'Invalid ID format',
      }),
  }),

  // Pagination validation
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

// Pre-built validation middlewares
const validationMiddlewares = {
  // User validations
  validateUserLogin: validateRequest(validationSchemas.userLogin, 'body'),
  validateUserRegister: validateRequest(validationSchemas.userRegister, 'body'),
  validateChangePassword: validateRequest(validationSchemas.changePassword, 'body'),
  validateForgotPassword: validateRequest(validationSchemas.forgotPassword, 'body'),
  validateResetPassword: validateRequest(validationSchemas.resetPassword, 'body'),

  // Parameter validations
  validateMongoId: validateRequest(validationSchemas.mongoIdParam, 'params'),

  // Query validations
  validatePagination: validateRequest(validationSchemas.pagination, 'query'),
};

module.exports = {
  validateRequest,
  validationSchemas,
  validationMiddlewares,
};