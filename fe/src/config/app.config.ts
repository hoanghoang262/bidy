// Application Configuration
// Centralized configuration management using environment variables

export const appConfig = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001",
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8001",
    timeout: 30000, // 30 seconds
    retries: 3,
  },

  // Application Settings
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Bidy",
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Vietnamese Online Auction Platform",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
    version: "1.0.0",
  },

  // Image Configuration
  images: {
    maxSize: parseInt(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE || "10485760"), // 10MB in bytes
    supportedFormats: (process.env.NEXT_PUBLIC_SUPPORTED_FORMATS || "jpeg,jpg,png,webp").split(","),
    quality: 85,
  },

  // Pagination Configuration
  pagination: {
    defaultPageSize: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || "12"),
    adminPageSize: parseInt(process.env.NEXT_PUBLIC_ADMIN_PAGE_SIZE || "10"),
    maxPageSize: 100,
  },

  // Real-time Updates
  realtime: {
    refreshInterval: 30000, // 30 seconds
    bidRefreshInterval: 5000, // 5 seconds for active bidding
    heartbeatInterval: 10000, // 10 seconds for WebSocket
  },

  // Feature Flags
  features: {
    chat: process.env.NEXT_PUBLIC_ENABLE_CHAT === "true",
    notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === "true",
    darkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === "true",
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  },

  // Development Configuration
  dev: {
    showDevTools: process.env.NEXT_PUBLIC_SHOW_DEV_TOOLS === "true",
    enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true",
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
  },

  // Security Configuration
  security: {
    maxLoginAttempts: 5,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    csrfProtection: true,
  },
} as const;

// Type-safe configuration getter
export const getConfig = <T extends keyof typeof appConfig>(section: T): typeof appConfig[T] => {
  return appConfig[section];
};

// Comprehensive environment validation
export const validateEnvironment = () => {
  const validationErrors: string[] = [];
  const validationWarnings: string[] = [];

  // Required environment variables by environment
  const requiredInProduction = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_APP_URL',
  ];

  const recommendedForProduction = [
    'NEXT_PUBLIC_WS_URL',
    'NEXT_PUBLIC_MAX_IMAGE_SIZE',
    'NEXT_PUBLIC_DEFAULT_PAGE_SIZE',
  ];

  // Validation functions
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidNumber = (value: string): boolean => {
    return !isNaN(Number(value)) && Number(value) >= 0;
  };

  const isValidBoolean = (value: string): boolean => {
    return value === 'true' || value === 'false';
  };

  // Check required variables
  requiredInProduction.forEach(envVar => {
    const value = process.env[envVar];
    if (!value) {
      if (appConfig.dev.isProduction) {
        validationErrors.push(`Missing required environment variable: ${envVar}`);
      } else {
        validationWarnings.push(`Missing ${envVar} (using default)`);
      }
    }
  });

  // Validate URL format
  const urlVars = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_WS_URL', 'NEXT_PUBLIC_APP_URL'];
  urlVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value && !isValidUrl(value)) {
      validationErrors.push(`Invalid URL format for ${envVar}: ${value}`);
    }
  });

  // Validate numeric values
  const numericVars = [
    'NEXT_PUBLIC_MAX_IMAGE_SIZE',
    'NEXT_PUBLIC_DEFAULT_PAGE_SIZE',
    'NEXT_PUBLIC_ADMIN_PAGE_SIZE'
  ];
  numericVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value && !isValidNumber(value)) {
      validationErrors.push(`Invalid numeric value for ${envVar}: ${value}`);
    }
  });

  // Validate boolean values
  const booleanVars = [
    'NEXT_PUBLIC_ENABLE_CHAT',
    'NEXT_PUBLIC_ENABLE_NOTIFICATIONS',
    'NEXT_PUBLIC_ENABLE_DARK_MODE',
    'NEXT_PUBLIC_SHOW_DEV_TOOLS',
    'NEXT_PUBLIC_ENABLE_DEBUG'
  ];
  booleanVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value && !isValidBoolean(value)) {
      validationErrors.push(`Invalid boolean value for ${envVar}: ${value} (must be 'true' or 'false')`);
    }
  });

  // Validate image formats
  const imageFormats = process.env.NEXT_PUBLIC_SUPPORTED_FORMATS;
  if (imageFormats) {
    const validFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
    const formats = imageFormats.split(',').map(f => f.trim().toLowerCase());
    const invalidFormats = formats.filter(format => !validFormats.includes(format));
    if (invalidFormats.length > 0) {
      validationErrors.push(`Invalid image formats: ${invalidFormats.join(', ')}. Supported: ${validFormats.join(', ')}`);
    }
  }

  // Environment-specific validation
  if (appConfig.dev.isProduction) {
    // Production-specific checks
    if (appConfig.api.baseUrl.includes('localhost')) {
      validationWarnings.push('Using localhost URL in production environment');
    }
    
    if (appConfig.dev.enableDebug) {
      validationWarnings.push('Debug mode is enabled in production');
    }

    recommendedForProduction.forEach(envVar => {
      if (!process.env[envVar]) {
        validationWarnings.push(`Recommended for production: ${envVar}`);
      }
    });
  }

  // Report validation results
  if (validationErrors.length > 0) {
    console.error('❌ Environment Validation Errors:');
    validationErrors.forEach(error => console.error(`  • ${error}`));
    
    if (appConfig.dev.isProduction) {
      throw new Error(`Environment validation failed: ${validationErrors.length} error(s)`);
    }
  }

  if (validationWarnings.length > 0) {
    console.warn('⚠️  Environment Validation Warnings:');
    validationWarnings.forEach(warning => console.warn(`  • ${warning}`));
  }

  if (validationErrors.length === 0 && validationWarnings.length === 0) {
    console.log('✅ Environment validation passed');
  }

  return {
    isValid: validationErrors.length === 0,
    errors: validationErrors,
    warnings: validationWarnings
  };
};

// Initialize environment validation
if (typeof window === 'undefined') {
  // Only run on server-side
  validateEnvironment();
}