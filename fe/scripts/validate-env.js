#!/usr/bin/env node

// Frontend Environment Validation Script - Relaxed Mode
// Validates essential Next.js environment variables with warnings instead of errors

const fs = require('fs');
const path = require('path');

console.log('🔍 Bidy Frontend - Environment Validation Tool\n');

// Check for environment files (optional check)
const envFiles = [
  { name: '.env (frontend)', path: path.join(__dirname, '..', '.env') },
  { name: '.env.example', path: path.join(__dirname, '..', '.env.example') }
];

console.log('📁 Environment Files:');
envFiles.forEach(({ name, path: filePath }) => {
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '⚠️ '} ${name}`);
});
console.log();

// Load environment variables from frontend directory (optional)
const feEnvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(feEnvPath)) {
  require('dotenv').config({ path: feEnvPath });
} else {
  console.log('ℹ️  No .env file found in frontend directory. Using defaults or system environment.');
}

// Relaxed validation - only essential variables
const validationRules = {
  essential: {
    'NEXT_PUBLIC_API_URL': 'API base URL (will use default if missing)',
  },
  optional: {
    'NEXT_PUBLIC_WS_URL': 'WebSocket URL for real-time features',
    'NEXT_PUBLIC_APP_URL': 'Application URL for redirects and links',
    'NEXT_PUBLIC_MAX_IMAGE_SIZE': 'Maximum image upload size',
    'NEXT_PUBLIC_DEFAULT_PAGE_SIZE': 'Default pagination size',
    'NEXT_PUBLIC_ENABLE_CHAT': 'Enable chat feature',
    'NEXT_PUBLIC_ENABLE_NOTIFICATIONS': 'Enable notifications',
    'NEXT_PUBLIC_ENABLE_DARK_MODE': 'Enable dark mode toggle',
    'NEXT_PUBLIC_SHOW_DEV_TOOLS': 'Show development tools',
    'NEXT_PUBLIC_ENABLE_DEBUG': 'Enable debug logging',
  }
};

let hasWarnings = false;
let criticalErrors = [];

// Check essential variables (warnings only, no build failure)
console.log('🔍 Essential Variables:');
Object.entries(validationRules.essential).forEach(([key, description]) => {
  const value = process.env[key];
  if (!value) {
    console.log(`   ⚠️  ${key}: Not set (${description})`);
    hasWarnings = true;
  } else {
    console.log(`   ✅ ${key}: ${value}`);
  }
});

// Check optional variables (informational only)
if (Object.keys(validationRules.optional).some(key => process.env[key])) {
  console.log('\n⚙️  Optional Variables (configured):');
  Object.entries(validationRules.optional).forEach(([key, description]) => {
    const value = process.env[key];
    if (value) {
      console.log(`   ✅ ${key}: ${value} (${description})`);
    }
  });
}

// Basic URL validation (only for critical errors)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (apiUrl) {
  try {
    new URL(apiUrl);
    console.log('\n🌐 URL Validation:');
    console.log(`   ✅ NEXT_PUBLIC_API_URL: Valid URL format`);
  } catch {
    criticalErrors.push(`NEXT_PUBLIC_API_URL has invalid URL format: ${apiUrl}`);
  }
}

// Environment warnings (non-blocking)
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && apiUrl && apiUrl.includes('localhost')) {
  console.log('\n⚠️  Environment Validation Warnings:');
  console.log('  • Using localhost URL in production environment');
  hasWarnings = true;
}

// Summary
console.log('\n📊 Validation Summary:');
if (criticalErrors.length > 0) {
  console.log('   ❌ Critical errors found:');
  criticalErrors.forEach(error => console.log(`     • ${error}`));
  console.log('\n   Fix these critical errors to continue.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('   ✅ Environment validation passed with recommendations.');
  process.exit(0);
} else {
  console.log('   ✅ All validations passed - environment is properly configured!');
  process.exit(0);
}