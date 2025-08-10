const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { response } = require('../util/response');
const { responseStatus } = require('../langs/vn');

/**
 * Rate limiting middleware configurations
 */
const rateLimiters = {
  // General API rate limiter
  general: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      ...response(responseStatus.fail, 'Too many requests, please try again later'),
      retryAfter: Math.round(15 * 60) // 15 minutes in seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Strict rate limiter for authentication endpoints
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
      ...response(responseStatus.fail, 'Too many authentication attempts, please try again later'),
      retryAfter: Math.round(15 * 60)
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Password reset rate limiter
  passwordReset: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 password reset requests per hour
    message: {
      ...response(responseStatus.fail, 'Too many password reset attempts, please try again later'),
      retryAfter: Math.round(60 * 60)
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
};

/**
 * Input sanitization middleware
 * Removes potentially dangerous characters and scripts
 */
const sanitizeInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    // Remove script tags and potential XSS
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  };

  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      const sanitized = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    } else if (Array.isArray(obj)) {
      return obj.map(item => sanitizeObject(item));
    } else if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    return obj;
  };

  // Sanitize request body, params, and query
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

/**
 * Security headers middleware using Helmet
 */
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false // Disable COEP for development
});

/**
 * API key validation middleware (if needed for future API versioning)
 */
const validateApiVersion = (req, res, next) => {
  const apiVersion = req.get('API-Version') || '1.0';
  
  // Define supported API versions
  const supportedVersions = ['1.0'];
  
  if (!supportedVersions.includes(apiVersion)) {
    return res.status(400).json(
      response(responseStatus.fail, 'Unsupported API version')
    );
  }
  
  req.apiVersion = apiVersion;
  next();
};

/**
 * Request logging middleware for security monitoring
 */
const securityLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    console.log(`[SECURITY] ${timestamp} - ${req.method} ${req.path} - IP: ${ip} - UA: ${userAgent}`);
  }
  next();
};

module.exports = {
  rateLimiters,
  sanitizeInput,
  securityHeaders,
  validateApiVersion,
  securityLogger
};