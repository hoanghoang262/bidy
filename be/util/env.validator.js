// Backend Environment Variables Validation
// Comprehensive validation system to ensure all environment variables are properly configured

const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

/**
 * Environment variable validation configuration
 */
const ENV_CONFIG = {
  // Required in all environments
  required: [
    'JWT_SECRET',
    'MONGODB_URI',
    'NODE_ENV'
  ],
  
  // Required in production
  requiredInProduction: [
    'CLIENT_URL',
    'SERVER_URL',
    'PORT'
  ],
  
  // Recommended for production
  recommendedForProduction: [
    'CLIENT_URL_PROD',
    'CLIENT_URL_PROD_WWW',
    'SERVER_URL_PROD',
    'ACCESS_KEY_ID',
    'SECRET_ACCESS_KEY'
  ],
  
  // Optional but validated if present
  optional: [
    'PAGE_NUMBER',
    'LIMIT_NUMBER',
    'ADMIN_LIMIT_NUMBER',
    'ID_ADMIN'
  ]
};

/**
 * Validation functions for different data types
 */
const validators = {
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  
  port: (value) => {
    const port = parseInt(value);
    return !isNaN(port) && port > 0 && port <= 65535;
  },
  
  number: (value) => {
    return !isNaN(Number(value)) && Number(value) >= 0;
  },
  
  string: (value) => {
    return typeof value === 'string' && value.trim().length > 0;
  },
  
  mongoUri: (value) => {
    return value.startsWith('mongodb://') || value.startsWith('mongodb+srv://');
  },
  
  environment: (value) => {
    return ['development', 'production', 'test', 'staging'].includes(value);
  },
  
  jwtSecret: (value) => {
    // JWT secret should be at least 32 characters for security
    return typeof value === 'string' && value.length >= 32;
  }
};

/**
 * Variable-specific validation rules
 */
const validationRules = {
  'JWT_SECRET': validators.jwtSecret,
  'MONGODB_URI': validators.mongoUri,
  'NODE_ENV': validators.environment,
  'PORT': validators.port,
  'CLIENT_URL': validators.url,
  'CLIENT_URL_PROD': validators.url,
  'CLIENT_URL_PROD_WWW': validators.url,
  'SERVER_URL': validators.url,
  'SERVER_URL_PROD': validators.url,
  'PAGE_NUMBER': validators.number,
  'LIMIT_NUMBER': validators.number,
  'ADMIN_LIMIT_NUMBER': validators.number,
  'ACCESS_KEY_ID': validators.string,
  'SECRET_ACCESS_KEY': validators.string,
  'ID_ADMIN': validators.string
};

/**
 * Check if .env file exists and is readable
 */
const checkEnvFile = () => {
  const envPath = path.join(__dirname, '../.env');
  const envExamplePath = path.join(__dirname, '../.env.example');
  
  const results = {
    envExists: fs.existsSync(envPath),
    envExampleExists: fs.existsSync(envExamplePath),
    envReadable: false
  };
  
  if (results.envExists) {
    try {
      fs.accessSync(envPath, fs.constants.R_OK);
      results.envReadable = true;
    } catch (error) {
      results.envReadable = false;
    }
  }
  
  return results;
};

/**
 * Validate environment variables
 */
const validateEnvironment = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  console.log(chalk.blue(`\n🔍 Validating environment variables (${process.env.NODE_ENV || 'unknown'})...\n`));
  
  const validationErrors = [];
  const validationWarnings = [];
  const validationInfo = [];
  
  // Check .env file status
  const envFileStatus = checkEnvFile();
  if (!envFileStatus.envExists) {
    validationWarnings.push('.env file not found - using system environment variables only');
  } else if (!envFileStatus.envReadable) {
    validationErrors.push('.env file exists but is not readable');
  }
  
  if (!envFileStatus.envExampleExists) {
    validationWarnings.push('.env.example file not found - consider creating one for documentation');
  }
  
  // Check required variables
  ENV_CONFIG.required.forEach(envVar => {
    const value = process.env[envVar];
    if (!value) {
      validationErrors.push(`Missing required environment variable: ${envVar}`);
    } else if (validationRules[envVar] && !validationRules[envVar](value)) {
      validationErrors.push(`Invalid format for ${envVar}: ${getValidationMessage(envVar)}`);
    }
  });
  
  // Check production-specific requirements
  if (isProduction) {
    ENV_CONFIG.requiredInProduction.forEach(envVar => {
      const value = process.env[envVar];
      if (!value) {
        validationErrors.push(`Missing required environment variable for production: ${envVar}`);
      } else if (validationRules[envVar] && !validationRules[envVar](value)) {
        validationErrors.push(`Invalid format for ${envVar}: ${getValidationMessage(envVar)}`);
      }
    });
    
    // Check recommended for production
    ENV_CONFIG.recommendedForProduction.forEach(envVar => {
      const value = process.env[envVar];
      if (!value) {
        validationWarnings.push(`Recommended for production: ${envVar}`);
      }
    });
    
    // Production-specific checks
    if (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('localhost')) {
      validationWarnings.push('CLIENT_URL contains localhost in production environment');
    }
    
    if (process.env.SERVER_URL && process.env.SERVER_URL.includes('localhost')) {
      validationWarnings.push('SERVER_URL contains localhost in production environment');
    }
  }
  
  // Validate optional variables if present
  ENV_CONFIG.optional.forEach(envVar => {
    const value = process.env[envVar];
    if (value && validationRules[envVar] && !validationRules[envVar](value)) {
      validationErrors.push(`Invalid format for ${envVar}: ${getValidationMessage(envVar)}`);
    }
  });
  
  // Security checks
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret) {
    if (jwtSecret.length < 32) {
      validationWarnings.push('JWT_SECRET is shorter than recommended (32+ characters)');
    }
    if (jwtSecret === 'your-secret-key' || jwtSecret === 'secret') {
      validationErrors.push('JWT_SECRET appears to be a default/weak value');
    }
  }
  
  // Database connection validation
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    if (mongoUri.includes('admin:admin') || mongoUri.includes('password')) {
      validationWarnings.push('MongoDB URI may contain weak credentials');
    }
    if (!isProduction && !mongoUri.includes('localhost') && !mongoUri.includes('127.0.0.1')) {
      validationInfo.push('Using remote MongoDB in development environment');
    }
  }
  
  // Port validation
  const port = process.env.PORT;
  if (port) {
    const portNum = parseInt(port);
    if (portNum < 1024 && !isProduction) {
      validationWarnings.push(`Port ${port} requires elevated privileges`);
    }
    if (portNum === 3000 || portNum === 8080) {
      validationInfo.push(`Using common port ${port} - ensure no conflicts`);
    }
  }
  
  // Report results
  let hasErrors = validationErrors.length > 0;
  let hasWarnings = validationWarnings.length > 0;
  
  if (hasErrors) {
    console.log(chalk.red('❌ Environment Validation Errors:'));
    validationErrors.forEach(error => {
      console.log(chalk.red(`  • ${error}`));
    });
    console.log();
  }
  
  if (hasWarnings) {
    console.log(chalk.yellow('⚠️  Environment Validation Warnings:'));
    validationWarnings.forEach(warning => {
      console.log(chalk.yellow(`  • ${warning}`));
    });
    console.log();
  }
  
  if (validationInfo.length > 0) {
    console.log(chalk.cyan('ℹ️  Environment Information:'));
    validationInfo.forEach(info => {
      console.log(chalk.cyan(`  • ${info}`));
    });
    console.log();
  }
  
  if (!hasErrors && !hasWarnings) {
    console.log(chalk.green('✅ Environment validation passed - all configurations are valid\n'));
  } else if (!hasErrors) {
    console.log(chalk.yellow('✅ Environment validation passed with warnings\n'));
  }
  
  // Fail in production if there are errors
  if (hasErrors && isProduction) {
    console.log(chalk.red('🚨 Stopping application due to environment validation errors in production\n'));
    process.exit(1);
  }
  
  return {
    isValid: !hasErrors,
    errors: validationErrors,
    warnings: validationWarnings,
    info: validationInfo
  };
};

/**
 * Get validation message for specific environment variable
 */
const getValidationMessage = (envVar) => {
  const messages = {
    'JWT_SECRET': 'must be at least 32 characters long',
    'MONGODB_URI': 'must start with mongodb:// or mongodb+srv://',
    'NODE_ENV': 'must be one of: development, production, test, staging',
    'PORT': 'must be a valid port number (1-65535)',
    'CLIENT_URL': 'must be a valid URL',
    'CLIENT_URL_PROD': 'must be a valid URL',
    'CLIENT_URL_PROD_WWW': 'must be a valid URL',
    'SERVER_URL': 'must be a valid URL',
    'SERVER_URL_PROD': 'must be a valid URL',
    'PAGE_NUMBER': 'must be a positive number',
    'LIMIT_NUMBER': 'must be a positive number',
    'ADMIN_LIMIT_NUMBER': 'must be a positive number',
    'ACCESS_KEY_ID': 'must be a non-empty string',
    'SECRET_ACCESS_KEY': 'must be a non-empty string',
    'ID_ADMIN': 'must be a non-empty string'
  };
  
  return messages[envVar] || 'invalid format';
};

/**
 * Display environment configuration summary
 */
const displayEnvironmentSummary = () => {
  console.log(chalk.blue('\n📋 Environment Configuration Summary:'));
  console.log(chalk.blue('================================================\n'));
  
  console.log(chalk.cyan('Core Configuration:'));
  console.log(`  Environment: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`  Port: ${process.env.PORT || 'not set'}`);
  console.log(`  MongoDB: ${process.env.MONGODB_URI ? '✓ configured' : '✗ not set'}`);
  console.log(`  JWT Secret: ${process.env.JWT_SECRET ? '✓ configured' : '✗ not set'}`);
  
  console.log(chalk.cyan('\nClient Configuration:'));
  console.log(`  Client URL: ${process.env.CLIENT_URL || 'not set'}`);
  console.log(`  Production URL: ${process.env.CLIENT_URL_PROD || 'not set'}`);
  
  console.log(chalk.cyan('\nServer Configuration:'));
  console.log(`  Server URL: ${process.env.SERVER_URL || 'not set'}`);
  console.log(`  Production URL: ${process.env.SERVER_URL_PROD || 'not set'}`);
  
  console.log(chalk.cyan('\nPagination Settings:'));
  console.log(`  Page Number: ${process.env.PAGE_NUMBER || '1 (default)'}`);
  console.log(`  Limit Number: ${process.env.LIMIT_NUMBER || '10 (default)'}`);
  console.log(`  Admin Limit: ${process.env.ADMIN_LIMIT_NUMBER || '10 (default)'}`);
  
  console.log();
};

module.exports = {
  validateEnvironment,
  displayEnvironmentSummary,
  checkEnvFile
};