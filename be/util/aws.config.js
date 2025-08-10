/**
 * Centralized AWS configuration
 * Single point for S3 and AWS service setup
 */

const aws = require('aws-sdk');

// Configure AWS with environment variables
aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

// Create reusable S3 instance
const s3 = new aws.S3();

/**
 * Get presigned URL for S3 object
 * @param {string} key - S3 object key
 * @returns {string} Presigned URL
 */
const getPresignedUrl = (key) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  };
  return s3.getSignedUrl('getObject', params);
};

module.exports = {
  s3,
  getPresignedUrl,
};