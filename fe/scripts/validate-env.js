#!/usr/bin/env node

// Frontend Environment Validation Script
// Validates Next.js environment variables before build/start

const fs = require('fs');
const path = require('path');

console.log('🔍 Bidy Frontend - Environment Validation Tool\n');

// Check for environment files  
const envFiles = [
  { name: '.env (frontend)', path: path.join(__dirname, '..', '.env') },
  { name: '.env.example', path: path.join(__dirname, '..', '.env.example') }
];

console.log('📁 Environment Files:');
envFiles.forEach(({ name, path: filePath }) => {
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${name}`);
});
console.log();

// Load environment variables from frontend directory
const feEnvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(feEnvPath)) {
  require('dotenv').config({ path: feEnvPath });
} else {
  console.log('⚠️  No .env file found in frontend directory!');
  console.log('   Please create .env file in fe/ directory\\n');
  process.exit(1);
}

// Validation rules
const validationRules = {
  required: {
    'NEXT_PUBLIC_API_URL': 'API base URL',
  },
  recommended: {
    'NEXT_PUBLIC_WS_URL': 'WebSocket URL for real-time features',
    'NEXT_PUBLIC_APP_URL': 'Application URL for redirects and links',
    'NEXT_PUBLIC_MAX_IMAGE_SIZE': 'Maximum image upload size',
    'NEXT_PUBLIC_DEFAULT_PAGE_SIZE': 'Default pagination size',
  },
  optional: {
    'NEXT_PUBLIC_ENABLE_CHAT': 'Enable chat feature',
    'NEXT_PUBLIC_ENABLE_NOTIFICATIONS': 'Enable notifications',
    'NEXT_PUBLIC_ENABLE_DARK_MODE': 'Enable dark mode toggle',
    'NEXT_PUBLIC_SHOW_DEV_TOOLS': 'Show development tools',
    'NEXT_PUBLIC_ENABLE_DEBUG': 'Enable debug logging',
  }
};

let hasErrors = false;
let hasWarnings = false;

// Validate required variables
console.log('🔍 Required Variables:');
Object.entries(validationRules.required).forEach(([key, description]) => {
  const value = process.env[key];
  if (!value) {
    console.log(`   ❌ ${key}: Missing (${description})`);
    hasErrors = true;
  } else {
    console.log(`   ✅ ${key}: ${value}`);
  }
});

// Check recommended variables
console.log('\n💡 Recommended Variables:');
Object.entries(validationRules.recommended).forEach(([key, description]) => {
  const value = process.env[key];
  if (!value) {
    console.log(`   ⚠️  ${key}: Not set (${description})`);
    hasWarnings = true;
  } else {
    console.log(`   ✅ ${key}: ${value}`);
  }
});

// Check optional variables
console.log('\n⚙️  Optional Variables:');
Object.entries(validationRules.optional).forEach(([key, description]) => {
  const value = process.env[key];
  console.log(`   ${value ? '✅' : '➖'} ${key}: ${value || 'Not set'} (${description})`);
});

// URL validation
console.log('\n🌐 URL Validation:');
const urlVars = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_WS_URL', 'NEXT_PUBLIC_APP_URL'];
urlVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    try {
      new URL(value);
      console.log(`   ✅ ${envVar}: Valid URL format`);
    } catch (error) {
      console.log(`   ❌ ${envVar}: Invalid URL format - ${value}`);
      hasErrors = true;
    }
  }
});

// Numeric validation
console.log('\n🔢 Numeric Validation:');
const numericVars = ['NEXT_PUBLIC_MAX_IMAGE_SIZE', 'NEXT_PUBLIC_DEFAULT_PAGE_SIZE'];
numericVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue <= 0) {
      console.log(`   ❌ ${envVar}: Invalid numeric value - ${value}`);
      hasErrors = true;
    } else {
      console.log(`   ✅ ${envVar}: ${value}`);
    }
  }
});

// Environment-specific checks
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  console.log('\n🏭 Production Environment Checks:');
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl && apiUrl.includes('localhost')) {
    console.log('   ⚠️  API URL contains localhost in production');
    hasWarnings = true;
  }
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && !appUrl.startsWith('https://')) {
    console.log('   ⚠️  App URL should use HTTPS in production');
    hasWarnings = true;
  }
}

// Summary
console.log('\n📊 Validation Summary:');
if (!hasErrors && !hasWarnings) {
  console.log('   ✅ All validations passed - environment is properly configured!');
  process.exit(0);
} else if (!hasErrors) {
  console.log('   ⚠️  Validation passed with warnings - review recommendations above');
  process.exit(0);
} else {
  console.log('   ❌ Validation failed - please fix the errors above');
  process.exit(1);
}