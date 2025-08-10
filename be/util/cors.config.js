/**
 * Simple CORS configuration from environment string
 */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3001').split(',').map(url => url.trim());

const corsConfig = {
  origin: allowedOrigins,
  credentials: true,
};

module.exports = { corsConfig, socketCorsConfig: { origin: allowedOrigins } };