const { appConfig, validateEnvironment } = require('./src/config/app.config.ts');

console.log('🧪 Testing Environment Validation\n');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

console.log('\nRunning validation...');
try {
  const result = validateEnvironment();
  console.log('Validation result:', result);
} catch (error) {
  console.error('Validation error:', error.message);
}