/**
 * Enhanced Logger utility for consistent logging across the application
 * Supports multiple log levels with environment-based filtering
 * Includes timestamps, structured output, and performance tracking
 */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logLevels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3,
    };

    this.currentLevel = this.getLogLevel();
    this.logToFile = process.env.LOG_TO_FILE === 'true';
    this.logDir = path.join(__dirname, '../logs');

    if (this.logToFile && !fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getLogLevel() {
    const envLevel = (process.env.LOG_LEVEL || 'INFO').toUpperCase();
    return this.logLevels[envLevel] !== undefined ? this.logLevels[envLevel] : this.logLevels.INFO;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const pid = process.pid;

    // Ensure meta is always an object
    const safeMeta = meta && typeof meta === 'object' && !Array.isArray(meta) ? meta : {};

    const baseInfo = {
      timestamp,
      level,
      pid,
      message,
      ...safeMeta,
    };

    if (process.env.NODE_ENV === 'production') {
      return JSON.stringify(baseInfo);
    }

    // Development format with colors
    const colors = {
      ERROR: chalk.red,
      WARN: chalk.yellow,
      INFO: chalk.blue,
      DEBUG: chalk.gray,
    };

    const colorFn = colors[level] || chalk.white;
    const metaStr = Object.keys(safeMeta).length > 0 ? ` ${JSON.stringify(safeMeta, null, 2)}` : '';

    return `${chalk.gray(timestamp)} ${colorFn(`[${level}]`)} ${chalk.cyan(`[${pid}]`)} ${message}${metaStr}`;
  }

  writeToFile(level, formattedMessage) {
    if (!this.logToFile) return;

    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDir, `${date}.log`);
    const timestamp = new Date().toISOString();

    fs.appendFileSync(logFile, `${timestamp} [${level}] ${formattedMessage}\n`);
  }

  log(level, message, meta = {}) {
    if (this.logLevels[level] > this.currentLevel) {
      return; // Skip if log level is below current threshold
    }

    const formattedMessage = this.formatMessage(level, message, meta);

    // Console output
    switch (level) {
      case 'ERROR':
        console.error(formattedMessage);
        break;
      case 'WARN':
        console.warn(formattedMessage);
        break;
      case 'INFO':
        console.info(formattedMessage);
        break;
      case 'DEBUG':
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }

    // File output (without colors for production)
    if (this.logToFile) {
      const plainMessage = process.env.NODE_ENV === 'production'
        ? formattedMessage
        : message + (Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '');
      this.writeToFile(level, plainMessage);
    }
  }

  // Public methods
  error(message, error = null, meta = {}) {
    const errorMeta = error ? {
      error: error.message || error,
      stack: error.stack,
      ...meta,
    } : meta;

    this.log('ERROR', message, errorMeta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  // Utility methods
  startTimer(label) {
    const start = Date.now();
    return {
      end: (message = `Timer ${label} completed`) => {
        const duration = Date.now() - start;
        this.info(message, { duration: `${duration}ms`, timer: label });
        return duration;
      },
    };
  }

  // Request logging helper
  request(req, message = 'Request processed', meta = {}) {
    const requestInfo = {
      method: req.method,
      url: req.url,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.idUser || req.user?.id,
      ...meta,
    };

    this.info(message, requestInfo);
  }

  // Database operation logging
  database(operation, collection, meta = {}) {
    this.debug(`Database ${operation}`, { collection, ...meta });
  }

  // Performance logging
  performance(metric, value, unit = 'ms', meta = {}) {
    this.info(`Performance: ${metric}`, { value, unit, ...meta });
  }
}

// Create singleton instance
const logger = new Logger();

// Add environment configuration logging on startup
logger.info('Logger initialized', {
  logLevel: Object.keys(logger.logLevels).find(key => logger.logLevels[key] === logger.currentLevel),
  environment: process.env.NODE_ENV,
  logToFile: logger.logToFile,
  logDir: logger.logToFile ? logger.logDir : null,
});

module.exports = logger;