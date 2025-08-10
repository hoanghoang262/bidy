// Core dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

require("dotenv").config();

// Configuration & validation
const { validateEnvironment, displayEnvironmentSummary } = require("./util/env.validator");
const { corsConfig, socketCorsConfig } = require("./util/cors.config");
require("./util/mongoose.js");

// Routes
const userRoute = require("./user_components/user.route.js");
const bidRoute = require("./auction_component/auction.route.js");
const adminRoute = require("./admin/admin.route.js");
const chatRoute = require("./chat/chat.route.js");

// Controllers & services
const { socket } = require("./chat/chat.controller.js");
const { startCronJob } = require("./cronJob");

// Middleware
const { 
  securityHeaders, 
  rateLimiters, 
  sanitizeInput, 
  securityLogger 
} = require("./Middlewares/security.middleware");
const { errorHandler, notFoundHandler } = require("./Middlewares/error.middleware");
const { staticFallbackHandler, staticSecurityHeaders } = require("./Middlewares/static.middleware");

// Initialize app
const app = express();

// Environment validation
const validationResult = validateEnvironment();
if (process.env.NODE_ENV !== 'production') {
  displayEnvironmentSummary();
}

// Security middleware - apply early
app.use(securityHeaders);
app.use(securityLogger); // Request logging for security monitoring
app.use(rateLimiters.general); // Apply general rate limiting
app.use(sanitizeInput); // Input sanitization for all requests

// CORS configuration
app.use(cors(corsConfig));
// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Handle JSON requests with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Handle form data
// Static file serving with security and fallback handling
app.use(staticSecurityHeaders); // Apply security headers to all requests
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(staticFallbackHandler); // Handle missing static files
app.use("/user", userRoute);
app.use("/auction", bidRoute);
app.use("/admin", adminRoute);
app.use("/chat", chatRoute);

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoints
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: require('./package.json').version || '1.0.0'
  });
});

app.get("/health/detailed", async (req, res) => {
  const mongoose = require('mongoose');
  
  try {
    // Check database connectivity
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: require('./package.json').version || '1.0.0',
      database: {
        status: dbStatus,
        host: process.env.MONGODB_URI ? 'configured' : 'not configured'
      },
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Error handling middleware - must be last
app.use(notFoundHandler); // Handle 404 routes
app.use(errorHandler); // Handle all other errors

// Export app for testing
module.exports = app;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  const server = app.listen(process.env.PORT || 8001, () => {
    console.log(`✅ Server is running on port ${process.env.PORT || 8001}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Start cron jobs after server is successfully running
    startCronJob();
    console.log('⚡️ Background services initialized');
  });

  const io = new Server(server, {
    cors: socketCorsConfig
  });
  socket(io);
}
