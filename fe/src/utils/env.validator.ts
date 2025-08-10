// Frontend Runtime Environment Validation
// Comprehensive validation that runs in the browser and during build

import { appConfig, validateEnvironment } from '@/config/app.config';

/**
 * Runtime environment validation that can run in the browser
 */
export const validateRuntimeEnvironment = () => {
  // Don't run validation in production browser to avoid exposing env details
  if (appConfig.dev.isProduction && typeof window !== 'undefined') {
    return { isValid: true, errors: [], warnings: [] };
  }
  
  const validationErrors: string[] = [];
  const validationWarnings: string[] = [];
  
  // API connectivity validation (only in browser)
  if (typeof window !== 'undefined') {
    validateApiConnectivity().then(result => {
      if (!result.isConnected) {
        console.warn('⚠️  API connectivity check failed:', result.error);
        console.warn('   This may be normal if the backend is not running');
      } else {
        console.log('✅ API connectivity validated');
      }
    });
  }
  
  // Configuration consistency checks
  const apiUrl = appConfig.api.baseUrl;
  const appUrl = appConfig.app.url;
  
  // Check for localhost in production
  if (appConfig.dev.isProduction) {
    if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
      validationErrors.push('API URL contains localhost in production environment');
    }
    
    if (appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {
      validationErrors.push('App URL contains localhost in production environment');
    }
  }
  
  // Check for HTTPS in production
  if (appConfig.dev.isProduction) {
    if (!apiUrl.startsWith('https://') && !apiUrl.startsWith('localhost')) {
      validationWarnings.push('API URL is not using HTTPS in production');
    }
    
    if (!appUrl.startsWith('https://') && !appUrl.startsWith('localhost')) {
      validationWarnings.push('App URL is not using HTTPS in production');
    }
  }
  
  // Validate pagination settings
  if (appConfig.pagination.defaultPageSize > appConfig.pagination.maxPageSize) {
    validationErrors.push('Default page size exceeds maximum page size');
  }
  
  if (appConfig.pagination.defaultPageSize <= 0) {
    validationErrors.push('Default page size must be greater than 0');
  }
  
  // Validate image settings
  if (appConfig.images.maxSize <= 0) {
    validationErrors.push('Maximum image size must be greater than 0');
  }
  
  if (appConfig.images.maxSize > 50 * 1024 * 1024) { // 50MB
    validationWarnings.push('Maximum image size is very large (>50MB)');
  }
  
  // Validate realtime settings
  if (appConfig.realtime.refreshInterval < 1000) {
    validationWarnings.push('Refresh interval is very short (<1s) - may cause high server load');
  }
  
  if (appConfig.realtime.bidRefreshInterval < 1000) {
    validationWarnings.push('Bid refresh interval is very short (<1s) - may cause high server load');
  }
  
  // Feature flag validation
  if (!appConfig.features.chat && !appConfig.features.notifications) {
    validationWarnings.push('Both chat and notifications are disabled - limited user interaction');
  }
  
  return {
    isValid: validationErrors.length === 0,
    errors: validationErrors,
    warnings: validationWarnings
  };
};

/**
 * Validate API connectivity
 */
const validateApiConnectivity = async (): Promise<{ isConnected: boolean; error?: string }> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${appConfig.api.baseUrl}/health`, {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    return {
      isConnected: response.status < 500, // Accept any response that's not a server error
    };
  } catch (error) {
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Validate configuration on application start
 */
export const runStartupValidation = () => {
  console.log('🔍 Running frontend environment validation...');
  
  // Run server-side validation first
  const serverValidation = validateEnvironment();
  
  // Run runtime validation
  const runtimeValidation = validateRuntimeEnvironment();
  
  // Combine results
  const allErrors = [...serverValidation.errors, ...runtimeValidation.errors];
  const allWarnings = [...serverValidation.warnings, ...runtimeValidation.warnings];
  
  // Log results
  if (allErrors.length > 0) {
    console.error('❌ Frontend validation errors:', allErrors);
    if (appConfig.dev.isProduction) {
      throw new Error(`Frontend validation failed: ${allErrors.length} error(s)`);
    }
  }
  
  if (allWarnings.length > 0) {
    console.warn('⚠️  Frontend validation warnings:', allWarnings);
  }
  
  if (allErrors.length === 0 && allWarnings.length === 0) {
    console.log('✅ Frontend environment validation passed');
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};

/**
 * Development-only environment debugging
 */
export const debugEnvironment = () => {
  if (!appConfig.dev.isDevelopment) {
    return;
  }
  
  console.group('🐛 Environment Debug Information');
  console.log('Configuration:', appConfig);
  console.log('Process env (NEXT_PUBLIC only):', 
    Object.entries(process.env)
      .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  );
  console.groupEnd();
};

/**
 * Production environment health check
 */
export const productionHealthCheck = async () => {
  if (!appConfig.dev.isProduction) {
    return { healthy: true };
  }
  
  const checks = {
    apiConnectivity: false,
    configurationValid: false,
    securityHeaders: false,
  };
  
  // Check API connectivity
  const apiCheck = await validateApiConnectivity();
  checks.apiConnectivity = apiCheck.isConnected;
  
  // Check configuration
  const configCheck = validateRuntimeEnvironment();
  checks.configurationValid = configCheck.isValid;
  
  // Check security headers (if available)
  if (typeof window !== 'undefined') {
    const hasSecurityHeaders = 
      document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null ||
      document.querySelector('meta[http-equiv="X-Frame-Options"]') !== null;
    checks.securityHeaders = hasSecurityHeaders;
  }
  
  const isHealthy = Object.values(checks).every(check => check);
  
  return {
    healthy: isHealthy,
    checks
  };
};