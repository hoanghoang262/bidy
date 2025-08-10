#!/usr/bin/env node

// Standalone Environment Validation Script
// Run this before starting the application to validate environment configuration

const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Load validation module
const { validateEnvironment, displayEnvironmentSummary, checkEnvFile } = require('../util/env.validator');

console.log('🔍 Bidy Backend - Environment Validation Tool\n');

// Check if .env file exists
const envFileStatus = checkEnvFile();

if (!envFileStatus.envExists) {
  console.log('⚠️  No .env file found. Please create one based on .env.example\n');
  
  // Check if .env.example exists to guide user
  if (envFileStatus.envExampleExists) {
    console.log('📋 You can copy .env.example to .env and update the values:');
    console.log('   cp .env.example .env\n');
  } else {
    console.log('❌ No .env.example file found either. Please create .env file manually.\n');
  }
}

// Run validation
try {
  const result = validateEnvironment();
  
  // Display summary
  displayEnvironmentSummary();
  
  // Exit with appropriate code
  if (result.isValid) {
    console.log('✅ Environment validation passed - ready to start application!\n');
    process.exit(0);
  } else {
    console.log('❌ Environment validation failed - please fix the errors above\n');
    process.exit(1);
  }
} catch (error) {
  console.error('💥 Validation script failed:', error.message);
  process.exit(1);
}