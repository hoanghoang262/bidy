// Mock express-rate-limit before importing
const mockRateLimit = jest.fn(() => (req, res, next) => next());
jest.mock('express-rate-limit', () => mockRateLimit);

const { 
  rateLimiters, 
  sanitizeInput, 
  validateApiVersion, 
  securityLogger 
} = require('../security.middleware');

describe('Security Middleware Tests', () => {
  let mockReq, mockRes, mockNext, consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: {},
      params: {},
      query: {},
      method: 'GET',
      path: '/test',
      ip: '127.0.0.1',
      get: jest.fn(),
      connection: { remoteAddress: '127.0.0.1' }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();

    // Mock console.log for security logger tests
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('sanitizeInput middleware', () => {
    it('should sanitize XSS script tags from request body', () => {
      mockReq.body = {
        username: 'testuser',
        message: '<script>alert("xss")</script>Hello world',
        nested: {
          content: '<script src="malicious.js"></script>Clean content'
        }
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.body.username).toBe('testuser');
      expect(mockReq.body.message).toBe('Hello world');
      expect(mockReq.body.nested.content).toBe('Clean content');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should sanitize javascript: URLs', () => {
      mockReq.body = {
        link: 'javascript:alert("xss")',
        safeLink: 'https://example.com'
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.body.link).toBe('alert("xss")');
      expect(mockReq.body.safeLink).toBe('https://example.com');
    });

    it('should sanitize event handlers', () => {
      mockReq.body = {
        content: '<div onclick="maliciousFunction()">Click me</div>',
        input: '<input onload="steal()" value="test">'
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.body.content).toBe('<div "maliciousFunction()">Click me</div>');
      expect(mockReq.body.input).toBe('<input "steal()" value="test">');
    });

    it('should handle arrays in request data', () => {
      mockReq.body = {
        items: [
          '<script>malicious()</script>Item 1',
          'Safe Item 2',
          { name: '<script>alert("nested")</script>Nested Item' }
        ]
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.body.items[0]).toBe('Item 1');
      expect(mockReq.body.items[1]).toBe('Safe Item 2');
      expect(mockReq.body.items[2].name).toBe('Nested Item');
    });

    it('should sanitize query parameters', () => {
      mockReq.query = {
        search: '<script>alert("search xss")</script>laptop',
        category: 'electronics'
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.query.search).toBe('laptop');
      expect(mockReq.query.category).toBe('electronics');
    });

    it('should sanitize route parameters', () => {
      mockReq.params = {
        id: '123<script>alert("param")</script>',
        slug: 'safe-slug'
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.params.id).toBe('123');
      expect(mockReq.params.slug).toBe('safe-slug');
    });

    it('should handle non-string values without modification', () => {
      mockReq.body = {
        number: 123,
        boolean: true,
        nullValue: null,
        undefinedValue: undefined,
        array: [1, 2, 3]
      };

      const originalBody = JSON.parse(JSON.stringify(mockReq.body));
      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.body).toEqual(originalBody);
    });

    it('should handle deeply nested objects', () => {
      mockReq.body = {
        level1: {
          level2: {
            level3: {
              malicious: '<script>deep xss</script>safe content'
            }
          }
        }
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.body.level1.level2.level3.malicious).toBe('safe content');
    });
  });

  describe('validateApiVersion middleware', () => {
    it('should accept supported API version', () => {
      mockReq.get.mockReturnValue('1.0');

      validateApiVersion(mockReq, mockRes, mockNext);

      expect(mockReq.apiVersion).toBe('1.0');
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should use default version when header is missing', () => {
      mockReq.get.mockReturnValue(undefined);

      validateApiVersion(mockReq, mockRes, mockNext);

      expect(mockReq.apiVersion).toBe('1.0');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject unsupported API version', () => {
      mockReq.get.mockReturnValue('2.5');

      validateApiVersion(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Unsupported API version'
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle invalid version format', () => {
      mockReq.get.mockReturnValue('invalid-version');

      validateApiVersion(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('securityLogger middleware', () => {
    it('should log requests in development mode', () => {
      process.env.NODE_ENV = 'development';
      mockReq.method = 'POST';
      mockReq.path = '/api/users';
      mockReq.get.mockReturnValue('Mozilla/5.0');

      securityLogger(mockReq, mockRes, mockNext);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[SECURITY\].*POST \/api\/users.*IP: 127\.0\.0\.1.*UA: Mozilla\/5\.0/)
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should not log in production mode', () => {
      process.env.NODE_ENV = 'production';

      securityLogger(mockReq, mockRes, mockNext);

      expect(consoleSpy).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle missing user agent gracefully', () => {
      process.env.NODE_ENV = 'development';
      mockReq.get.mockReturnValue(undefined);

      securityLogger(mockReq, mockRes, mockNext);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/UA: undefined/)
      );
    });

    it('should handle missing IP address gracefully', () => {
      process.env.NODE_ENV = 'development';
      mockReq.ip = undefined;
      mockReq.connection.remoteAddress = undefined;

      securityLogger(mockReq, mockRes, mockNext);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/IP: undefined/)
      );
    });
  });

  describe('Rate limiter configuration', () => {
    it('should export general rate limiter', () => {
      expect(rateLimiters.general).toBeDefined();
      expect(typeof rateLimiters.general).toBe('function');
    });

    it('should export auth rate limiter with stricter limits', () => {
      expect(rateLimiters.auth).toBeDefined();
      expect(typeof rateLimiters.auth).toBe('function');
    });

    it('should export password reset rate limiter', () => {
      expect(rateLimiters.passwordReset).toBeDefined();
      expect(typeof rateLimiters.passwordReset).toBe('function');
    });
  });

  describe('XSS Prevention edge cases', () => {
    it('should handle multiple script tag variations', () => {
      const xssVariations = [
        '<SCRIPT>alert("xss")</SCRIPT>',
        '<script >alert("xss")</script>',
        '<script\nsrc="malicious.js"></script>',
        '<script\tsrc="malicious.js"></script>'
      ];

      xssVariations.forEach((xss, index) => {
        mockReq.body = { content: `${xss}Safe content` };
        sanitizeInput(mockReq, mockRes, mockNext);
        expect(mockReq.body.content).toBe('Safe content');
      });
    });

    it('should handle complex nested HTML with XSS', () => {
      mockReq.body = {
        html: '<div><p>Hello</p><script>malicious()</script><span>World</span></div>'
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.body.html).toBe('<div><p>Hello</p><span>World</span></div>');
    });

    it('should preserve safe HTML-like content', () => {
      mockReq.body = {
        content: 'This is < 10 and > 5',
        code: 'if (x < y) { return true; }'
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.body.content).toBe('This is < 10 and > 5');
      expect(mockReq.body.code).toBe('if (x < y) { return true; }');
    });
  });

  describe('Performance considerations', () => {
    it('should handle large payloads efficiently', () => {
      const largeObject = {};
      for (let i = 0; i < 1000; i++) {
        largeObject[`field${i}`] = `value${i}`;
      }
      largeObject.malicious = '<script>alert("xss")</script>clean';

      mockReq.body = largeObject;

      const startTime = Date.now();
      sanitizeInput(mockReq, mockRes, mockNext);
      const endTime = Date.now();

      // Should complete quickly (under 100ms for 1000 fields)
      expect(endTime - startTime).toBeLessThan(100);
      expect(mockReq.body.malicious).toBe('clean');
    });
  });
});