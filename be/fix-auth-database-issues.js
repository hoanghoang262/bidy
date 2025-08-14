#!/usr/bin/env node

/**
 * Database cleanup script for authentication issues
 * Fixes status field type inconsistencies and ensures all passwords are hashed
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

// Load User model
const User = require('./user_components/models/user.model');

// Connect to MongoDB using the same connection string as the main app
require('dotenv').config();

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.dr5fib0.mongodb.net/auction';
    await mongoose.connect(connectionString, {
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Hash password helper
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Fix status field inconsistencies
const fixStatusFields = async () => {
  console.log('🔧 Fixing status field inconsistencies...');

  try {
    // Find all users with string status values
    const usersWithStringStatus = await User.find({
      status: { $type: 'string' },
    });

    console.log(`Found ${usersWithStringStatus.length} users with string status`);

    for (const user of usersWithStringStatus) {
      const booleanStatus = user.status === 'true';
      await User.findByIdAndUpdate(user._id, {
        status: booleanStatus,
      });
      console.log(`  ✓ Updated user ${user.user_name}: "${user.status}" → ${booleanStatus}`);
    }

    console.log('✅ Status field cleanup completed');
  } catch (error) {
    console.error('❌ Error fixing status fields:', error.message);
    throw error;
  }
};

// Fix password hashing
const fixPasswordHashing = async () => {
  console.log('🔧 Fixing password hashing...');

  try {
    // Find all users with plain text passwords (not starting with $2)
    const usersWithPlainPasswords = await User.find({
      password: { $not: /^\$2[aby]?\$/ },
    });

    console.log(`Found ${usersWithPlainPasswords.length} users with plain text passwords`);

    for (const user of usersWithPlainPasswords) {
      const hashedPassword = await hashPassword(user.password);
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
      });
      console.log(`  ✓ Hashed password for user ${user.user_name}`);
    }

    console.log('✅ Password hashing cleanup completed');
  } catch (error) {
    console.error('❌ Error fixing password hashing:', error.message);
    throw error;
  }
};

// Validate data integrity after fixes
const validateDataIntegrity = async () => {
  console.log('🔍 Validating data integrity...');

  try {
    // Check for any remaining string status values
    const stringStatusCount = await User.countDocuments({
      status: { $type: 'string' },
    });

    // Check for any remaining plain text passwords
    const plainPasswordCount = await User.countDocuments({
      password: { $not: /^\$2[aby]?\$/ },
    });

    // Check for required field completeness
    const incompleteUsers = await User.find({
      $or: [
        { user_name: { $exists: false } },
        { email: { $exists: false } },
        { password: { $exists: false } },
        { status: { $exists: false } },
      ],
    });

    console.log('📊 Data integrity report:');
    console.log(`  Users with string status: ${stringStatusCount}`);
    console.log(`  Users with plain passwords: ${plainPasswordCount}`);
    console.log(`  Incomplete user records: ${incompleteUsers.length}`);

    if (stringStatusCount === 0 && plainPasswordCount === 0) {
      console.log('✅ All authentication data integrity checks passed');
    } else {
      console.warn('⚠️  Some data integrity issues remain');
    }

    return {
      stringStatusCount,
      plainPasswordCount,
      incompleteUsersCount: incompleteUsers.length,
    };
  } catch (error) {
    console.error('❌ Error validating data integrity:', error.message);
    throw error;
  }
};

// Generate data consistency report
const generateReport = async () => {
  console.log('📋 Generating database report...');

  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: true });
    const inactiveUsers = await User.countDocuments({ status: false });

    // Check user roles
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    // Check for duplicates
    const duplicateUsernames = await User.aggregate([
      { $group: { _id: '$user_name', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    const duplicateEmails = await User.aggregate([
      { $group: { _id: '$email', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    console.log('📊 Database Summary Report:');
    console.log(`  Total users: ${totalUsers}`);
    console.log(`  Active users: ${activeUsers}`);
    console.log(`  Inactive users: ${inactiveUsers}`);
    console.log(`  Admin users: ${adminUsers}`);
    console.log(`  Regular users: ${regularUsers}`);
    console.log(`  Duplicate usernames: ${duplicateUsernames.length}`);
    console.log(`  Duplicate emails: ${duplicateEmails.length}`);

    if (duplicateUsernames.length > 0) {
      console.warn('⚠️  Duplicate usernames found:', duplicateUsernames.map(d => d._id));
    }

    if (duplicateEmails.length > 0) {
      console.warn('⚠️  Duplicate emails found:', duplicateEmails.map(d => d._id));
    }
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    throw error;
  }
};

// Main execution function
const main = async () => {
  console.log('🚀 Starting authentication database cleanup...\n');

  try {
    await connectDB();

    // Step 1: Fix status field inconsistencies
    await fixStatusFields();
    console.log('');

    // Step 2: Fix password hashing
    await fixPasswordHashing();
    console.log('');

    // Step 3: Validate data integrity
    const integrity = await validateDataIntegrity();
    console.log('');

    // Step 4: Generate report
    await generateReport();
    console.log('');

    if (integrity.stringStatusCount === 0 && integrity.plainPasswordCount === 0) {
      console.log('🎉 Database cleanup completed successfully!');
      console.log('   All status fields are now boolean');
      console.log('   All passwords are properly hashed');
    } else {
      console.warn('⚠️  Cleanup completed with some remaining issues');
    }

  } catch (error) {
    console.error('💥 Cleanup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  fixStatusFields,
  fixPasswordHashing,
  validateDataIntegrity,
  generateReport,
};