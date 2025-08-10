const { model, models, Schema } = require('mongoose');

const userSchema = new Schema(
  {
    user_name: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    avatar: {
      type: String,
    },
    full_name: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    identity: {
      type: String,
    },
    phone: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true },
);

// Performance optimization: Add database indexes for authentication and user queries
userSchema.index({ user_name: 1 }, { unique: true }); // For login by username
userSchema.index({ email: 1 }, { unique: true }); // For login/registration by email
userSchema.index({ identity: 1 }, { unique: true }); // For identity verification
userSchema.index({ phone: 1 }, { unique: true }); // For phone verification
userSchema.index({ passwordResetToken: 1 }); // For password reset functionality
userSchema.index({ status: 1 }); // For active/inactive user queries
userSchema.index({ role: 1 }); // For admin/user role queries

const User = models.User || model('User', userSchema);
module.exports = User;
