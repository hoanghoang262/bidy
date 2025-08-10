// Mock dependencies
jest.mock('../../util/response');
jest.mock('../../langs/vn');
jest.mock('../../util/logger');

const { 
  errorHandler, 
  notFoundHandler, 
  asyncHandler, 
  AppError 
} = require('../error.middleware');

const { response } = require('../../util/response');
const { responseStatus, transValidation } = require('../../langs/vn');
const logger = require('../../util/logger');

describe('Error Middleware Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
      get: jest.fn(() => 'Mozilla/5.0')
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();

    // Mock response utility
    response.mockImplementation((status, message, data) => ({
      status,
      message,
      data
    }));

    // Mock translation objects
    responseStatus.fail = 'fail';
    transValidation.internal_error = 'Internal Server Error';

    // Mock logger
    logger.error = jest.fn();
    logger.warn = jest.fn();
  });

  describe('errorHandler middleware', () => {
    it('should handle Mongoose validation errors', () => {
      const validationError = {
        name: 'ValidationError',
        errors: {
          email: { message: 'Email is required' },
          password: { message: 'Password must be at least 6 characters' }
        }
      };

      errorHandler(validationError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        'Error occurred',
        validationError,
        expect.objectContaining({
          method: 'GET',
          url: '/test',
          ip: '127.0.0.1'
        })
      );
    });

    it('should handle Mongoose cast errors (invalid ObjectId)', () => {
      const castError = {
        name: 'CastError',
        path: '_id',
        value: 'invalid-id'
      };

      errorHandler(castError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(response).toHaveBeenCalledWith('fail', 'Invalid ID format', undefined);
    });

    it('should handle Mongoose duplicate key errors', () => {
      const duplicateError = {
        code: 11000,
        keyValue: { email: 'test@example.com' }
      };

      errorHandler(duplicateError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(response).toHaveBeenCalledWith('fail', 'email already exists', undefined);
    });

    it('should handle JWT token errors', () => {
      const jwtError = {
        name: 'JsonWebTokenError',
        message: 'invalid signature'
      };

      errorHandler(jwtError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(response).toHaveBeenCalledWith('fail', 'Invalid token', undefined);
    });

    it('should handle JWT expired token errors', () => {
      const expiredError = {
        name: 'TokenExpiredError',
        message: 'jwt expired'
      };

      errorHandler(expiredError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(response).toHaveBeenCalledWith('fail', 'Token expired', undefined);
    });

    it('should handle custom operational errors', () => {
      const operationalError = {
        isOperational: true,
        statusCode: 404,
        message: 'User not found'
      };

      errorHandler(operationalError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(response).toHaveBeenCalledWith('fail', 'User not found', undefined);
    });

    it('should handle rate limit errors', () => {
      const rateLimitError = {
        type: 'rate_limit_error',
        message: 'Too many requests from this IP'
      };

      errorHandler(rateLimitError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(response).toHaveBeenCalledWith('fail', 'Too many requests', undefined);
    });

    it('should handle Multer file upload errors', () => {
      const uploadErrors = [
        { code: 'LIMIT_FILE_SIZE', message: 'File too large' },
        { code: 'LIMIT_FILE_COUNT', message: 'Too many files' },
        { code: 'LIMIT_UNEXPECTED_FILE', message: 'Unexpected file field' }
      ];

      const expectedResponses = [
        { status: 413, message: 'File size too large' },
        { status: 400, message: 'Too many files' },
        { status: 400, message: 'Unexpected file field' }
      ];

      uploadErrors.forEach((error, index) => {
        jest.clearAllMocks();
        errorHandler(error, mockReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(expectedResponses[index].status);
        expect(response).toHaveBeenCalledWith('fail', expectedResponses[index].message, undefined);
      });
    });

    it('should handle generic errors with development details', () => {
      process.env.NODE_ENV = 'development';
      
      const genericError = new Error('Something went wrong');
      genericError.stack = 'Error: Something went wrong\n    at test.js:1:1';

      errorHandler(genericError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(response).toHaveBeenCalledWith(
        'fail',
        'Internal Server Error',
        expect.objectContaining({
          stack: expect.stringContaining('Error: Something went wrong'),
          error: 'Something went wrong'
        })
      );
    });

    it('should handle generic errors without development details in production', () => {
      process.env.NODE_ENV = 'production';
      
      const genericError = new Error('Something went wrong');

      errorHandler(genericError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(response).toHaveBeenCalledWith('fail', 'Internal Server Error', undefined);
    });

    it('should log all errors', () => {
      const testError = new Error('Test error');

      errorHandler(testError, mockReq, mockRes, mockNext);

      expect(logger.error).toHaveBeenCalledWith(
        'Error occurred',
        testError,
        expect.objectContaining({
          method: 'GET',
          url: '/test',
          ip: '127.0.0.1',
          userAgent: 'Mozilla/5.0'
        })
      );
    });
  });

  describe('notFoundHandler middleware', () => {
    it('should handle 404 routes', () => {
      mockReq.originalUrl = '/api/non-existent';

      notFoundHandler(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(response).toHaveBeenCalledWith('fail', 'Route /api/non-existent not found');
      expect(logger.warn).toHaveBeenCalledWith(
        'Route not found',
        null,
        expect.objectContaining({
          method: 'GET',
          url: '/api/non-existent',
          ip: '127.0.0.1'
        })
      );
    });

    it('should log 404 requests for monitoring', () => {
      mockReq.originalUrl = '/suspicious/path';
      mockReq.method = 'POST';

      notFoundHandler(mockReq, mockRes, mockNext);

      expect(logger.warn).toHaveBeenCalledWith(
        'Route not found',
        null,
        expect.objectContaining({
          method: 'POST',
          url: '/suspicious/path'
        })
      );
    });
  });

  describe('asyncHandler utility', () => {
    it('should catch async function errors and pass to next', async () => {
      const asyncError = new Error('Async operation failed');
      const asyncFunction = jest.fn().mockRejectedValue(asyncError);
      
      const wrappedFunction = asyncHandler(asyncFunction);
      
      await wrappedFunction(mockReq, mockRes, mockNext);

      expect(asyncFunction).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(asyncError);
    });

    it('should handle successful async functions', async () => {
      const successResult = { success: true };
      const asyncFunction = jest.fn().mockResolvedValue(successResult);
      
      const wrappedFunction = asyncHandler(asyncFunction);
      
      await wrappedFunction(mockReq, mockRes, mockNext);

      expect(asyncFunction).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle synchronous functions that return promises', async () => {
      const syncFunction = (req, res, next) => {
        return Promise.resolve('sync result');
      };
      
      const wrappedFunction = asyncHandler(syncFunction);
      
      await wrappedFunction(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle functions that throw synchronously', async () => {
      const syncError = new Error('Sync error');
      const syncFunction = () => {
        throw syncError;
      };
      
      const wrappedFunction = asyncHandler(syncFunction);
      
      // Call the wrapped function - it should catch the error and call next
      await wrappedFunction(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(syncError);
    });
  });

  describe('AppError class', () => {
    it('should create operational error with status code', () => {
      const appError = new AppError('User not found', 404);

      expect(appError.message).toBe('User not found');
      expect(appError.statusCode).toBe(404);
      expect(appError.isOperational).toBe(true);
      expect(appError instanceof Error).toBe(true);
    });

    it('should capture stack trace', () => {
      const appError = new AppError('Test error', 400);

      expect(appError.stack).toBeDefined();
      expect(appError.stack).toContain('Test error');
    });

    it('should handle different status codes', () => {
      const testCases = [
        { message: 'Bad Request', status: 400 },
        { message: 'Unauthorized', status: 401 },
        { message: 'Forbidden', status: 403 },
        { message: 'Not Found', status: 404 },
        { message: 'Internal Server Error', status: 500 }
      ];

      testCases.forEach(({ message, status }) => {
        const appError = new AppError(message, status);
        expect(appError.message).toBe(message);
        expect(appError.statusCode).toBe(status);
        expect(appError.isOperational).toBe(true);
      });
    });
  });

  describe('Error context and logging', () => {
    it('should include request context in error logs', () => {
      const contextError = new Error('Context test error');
      
      mockReq.method = 'POST';
      mockReq.originalUrl = '/api/test';
      mockReq.ip = '192.168.1.100';
      mockReq.get.mockReturnValue('Custom User Agent');

      errorHandler(contextError, mockReq, mockRes, mockNext);

      expect(logger.error).toHaveBeenCalledWith(
        'Error occurred',
        contextError,
        expect.objectContaining({
          method: 'POST',
          url: '/api/test',
          ip: '192.168.1.100',
          userAgent: 'Custom User Agent'
        })
      );
    });

    it('should handle missing request context gracefully', () => {
      const contextError = new Error('Missing context error');
      
      mockReq.get.mockReturnValue(undefined);
      mockReq.ip = undefined;

      errorHandler(contextError, mockReq, mockRes, mockNext);

      expect(logger.error).toHaveBeenCalledWith(
        'Error occurred',
        contextError,
        expect.objectContaining({
          method: 'GET',
          url: '/test',
          ip: undefined,
          userAgent: undefined
        })
      );
    });
  });
});