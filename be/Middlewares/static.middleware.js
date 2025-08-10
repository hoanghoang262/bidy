const path = require('path');
const fs = require('fs');
const logger = require('../util/logger');

/**
 * Middleware to handle missing static files with fallback
 */
const staticFallbackHandler = (req, res, next) => {
  // Only handle requests to /uploads
  if (!req.path.startsWith('/uploads/')) {
    return next();
  }

  const filePath = path.join(__dirname, '..', req.path);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    return next();
  }

  // Log missing file for debugging
  logger.warn('Missing static file requested', {
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Determine file type for appropriate fallback
  const ext = path.extname(req.path).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
    // Image fallback - return a 1x1 transparent pixel
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=3600');
    
    // 1x1 transparent PNG in base64
    const transparentPixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI/hcKGLwAAAABJRU5ErkJggg==',
      'base64'
    );
    
    return res.status(200).end(transparentPixel);
  }

  // For non-image files, continue to 404 handler
  next();
};

/**
 * Create placeholder image for missing images
 */
const createPlaceholderImage = (width = 300, height = 200, text = 'Image Not Found') => {
  // This would require a library like jimp or sharp to generate
  // For now, return the transparent pixel
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI/hcKGLwAAAABJRU5ErkJggg==',
    'base64'
  );
};

/**
 * Middleware to add security headers for static files
 */
const staticSecurityHeaders = (req, res, next) => {
  if (req.path.startsWith('/uploads/')) {
    // Add security headers for static files
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    
    // Set appropriate caching headers
    const ext = path.extname(req.path).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      res.set('Cache-Control', 'public, max-age=86400'); // 1 day cache for images
    }
  }
  next();
};

module.exports = {
  staticFallbackHandler,
  staticSecurityHeaders,
  createPlaceholderImage
};