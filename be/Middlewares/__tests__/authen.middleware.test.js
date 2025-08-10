const jwt = require('jsonwebtoken');
const { isAuth, isAdmin } = require('../authen.middleware');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../util/response');
jest.mock('../../langs/vn');

const { response } = require('../../util/response');
const { responseStatus } = require('../../langs/vn');

describe('Authentication Middleware Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      headers: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();
    
    process.env.JWT_SECRET = 'test-jwt-secret';
    
    // Mock response utility
    response.mockImplementation((status, message, data) => ({
      status,
      message,
      data
    }));
    
    // Mock responseStatus
    responseStatus.fail = 'fail';
  });

  describe('isAuth middleware', () => {
    it('should authenticate valid Bearer token', () => {
      const mockPayload = {
        idUser: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'user'
      };

      mockReq.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ payload: mockPayload });

      isAuth(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-jwt-secret');
      expect(mockReq.idUser).toBe(mockPayload.idUser);
      expect(mockReq.email).toBe(mockPayload.email);
      expect(mockReq.role).toBe(mockPayload.role);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should authenticate direct token (without Bearer prefix)', () => {
      const mockPayload = {
        idUser: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'user'
      };

      mockReq.headers.authorization = 'direct-token';
      jwt.verify.mockReturnValue({ payload: mockPayload });

      isAuth(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('direct-token', 'test-jwt-secret');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject request with no authorization header', () => {
      isAuth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
      expect(response).toHaveBeenCalledWith('fail', 'Authentication required: No token provided');
    });

    it('should reject request with expired token', () => {
      mockReq.headers.authorization = 'Bearer expired-token';
      
      const tokenError = new Error('Token expired');
      tokenError.name = 'TokenExpiredError';
      jwt.verify.mockImplementation(() => {
        throw tokenError;
      });

      isAuth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalled();
      expect(response).toHaveBeenCalledWith('fail', 'Authentication required: Token expired');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', () => {
      mockReq.headers.authorization = 'Bearer invalid-token';
      
      const tokenError = new Error('Invalid signature');
      tokenError.name = 'JsonWebTokenError';
      jwt.verify.mockImplementation(() => {
        throw tokenError;
      });

      isAuth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(response).toHaveBeenCalledWith('fail', 'Authentication required: Invalid token');
    });

    it('should handle malformed Bearer token', () => {
      mockReq.headers.authorization = 'Bearer ';
      
      const tokenError = new Error('jwt malformed');
      jwt.verify.mockImplementation(() => {
        throw tokenError;
      });

      isAuth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(response).toHaveBeenCalledWith('fail', 'Authentication required: Invalid token');
    });
  });

  describe('isAdmin middleware', () => {
    it('should allow access for valid admin user', () => {
      const mockPayload = {
        idUser: '507f1f77bcf86cd799439011',
        email: 'admin@example.com',
        role: 'admin'
      };

      mockReq.headers.authorization = 'Bearer admin-token';
      jwt.verify.mockReturnValue({ payload: mockPayload });

      isAdmin(mockReq, mockRes, mockNext);

      expect(mockReq.role).toBe('admin');
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access for non-admin user', () => {
      const mockPayload = {
        idUser: '507f1f77bcf86cd799439011',
        email: 'user@example.com',
        role: 'user'
      };

      mockReq.headers.authorization = 'Bearer user-token';
      jwt.verify.mockReturnValue({ payload: mockPayload });

      // Mock the nested authentication call
      const originalIsAuth = isAuth;
      jest.doMock('../authen.middleware', () => ({
        ...jest.requireActual('../authen.middleware'),
        isAuth: jest.fn((req, res, next) => {
          req.role = 'user';
          next();
        })
      }));

      isAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(response).toHaveBeenCalledWith('fail', 'Admin access required');
    });

    it('should deny access for user with no role', () => {
      const mockPayload = {
        idUser: '507f1f77bcf86cd799439011',
        email: 'user@example.com'
        // No role field
      };

      mockReq.headers.authorization = 'Bearer user-token';
      jwt.verify.mockReturnValue({ payload: mockPayload });

      isAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it('should deny access for unauthenticated request', () => {
      // No authorization header
      isAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(response).toHaveBeenCalledWith('fail', 'Authentication required: No token provided');
    });

    it('should deny access for user with empty role', () => {
      const mockPayload = {
        idUser: '507f1f77bcf86cd799439011',
        email: 'user@example.com',
        role: ''
      };

      mockReq.headers.authorization = 'Bearer user-token';
      jwt.verify.mockReturnValue({ payload: mockPayload });

      isAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe('Token format handling', () => {
    it('should handle various token formats correctly', () => {
      const testCases = [
        { header: 'Bearer token123', expectedToken: 'token123' },
        { header: 'bearer token123', expectedToken: 'token123' }, // Case insensitive
        { header: 'token123', expectedToken: 'token123' }, // Direct token
        { header: 'BEARER token123', expectedToken: 'token123' } // Uppercase
      ];

      testCases.forEach((testCase, index) => {
        jest.clearAllMocks();
        
        const mockPayload = {
          idUser: `user${index}`,
          email: `test${index}@example.com`,
          role: 'user'
        };

        mockReq.headers.authorization = testCase.header;
        jwt.verify.mockReturnValue({ payload: mockPayload });

        isAuth(mockReq, mockRes, mockNext);

        expect(jwt.verify).toHaveBeenCalledWith(testCase.expectedToken, 'test-jwt-secret');
      });
    });
  });

  describe('JWT Secret handling', () => {
    it('should use JWT_SECRET from environment', () => {
      process.env.JWT_SECRET = 'custom-secret-key';

      mockReq.headers.authorization = 'Bearer test-token';
      jwt.verify.mockReturnValue({ 
        payload: { idUser: 'test', email: 'test@test.com', role: 'user' }
      });

      isAuth(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('test-token', 'custom-secret-key');
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle jwt.verify throwing non-standard errors', () => {
      mockReq.headers.authorization = 'Bearer bad-token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      isAuth(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(response).toHaveBeenCalledWith('fail', 'Authentication required: Invalid token');
    });

    it('should handle missing payload in decoded token', () => {
      mockReq.headers.authorization = 'Bearer malformed-token';
      jwt.verify.mockReturnValue({}); // No payload

      isAuth(mockReq, mockRes, mockNext);

      expect(mockReq.idUser).toBeUndefined();
      expect(mockReq.email).toBeUndefined();
      expect(mockReq.role).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });
});