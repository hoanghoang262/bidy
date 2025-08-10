const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../models/user.model');
jest.mock('../models/wishlist.model');
jest.mock('../../util/helper');
jest.mock('nodemailer');

const User = require('../models/user.model');
const { hashPassword } = require('../../util/helper');
const nodemailer = require('nodemailer');

// Mock nodemailer
const mockSendMail = jest.fn().mockResolvedValue(true);
nodemailer.createTransport = jest.fn(() => ({
  sendMail: mockSendMail
}));

// Import the functions we want to test
const userService = require('../user.service');

describe('User Service - Password Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('loginUser', () => {
    it('should successfully login with correct credentials', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        user_name: 'testuser',
        password: await bcrypt.hash('password123', 10),
        email: 'test@example.com',
        role: 'user',
        status: 'true'
      };

      User.findOne.mockResolvedValue(mockUser);

      const result = await userService.loginUser('testuser', 'password123');

      expect(User.findOne).toHaveBeenCalledWith({
        user_name: 'testuser',
        status: 'true'
      });
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.idUser).toBe(mockUser._id);
    });

    it('should return null for invalid password', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        user_name: 'testuser',
        password: await bcrypt.hash('correctpassword', 10),
        email: 'test@example.com',
        role: 'user',
        status: 'true'
      };

      User.findOne.mockResolvedValue(mockUser);

      const result = await userService.loginUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await userService.loginUser('nonexistent', 'password');

      expect(result).toBeNull();
    });

    it('should handle lowercase username conversion', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        user_name: 'testuser',
        password: await bcrypt.hash('password123', 10),
        email: 'test@example.com',
        role: 'user',
        status: 'true'
      };

      User.findOne.mockResolvedValue(mockUser);

      await userService.loginUser('TestUser', 'password123');

      expect(User.findOne).toHaveBeenCalledWith({
        user_name: 'testuser',
        status: 'true'
      });
    });
  });

  describe('register', () => {
    it('should hash password when creating new user', async () => {
      User.findOne.mockResolvedValue(null); // No existing user
      User.prototype.save = jest.fn().mockResolvedValue(true);
      hashPassword.mockResolvedValue('hashed_password_123');

      const result = await userService.register(
        'newuser',
        'plainpassword',
        'New User',
        'new@example.com',
        '123456789',
        '0123456789'
      );

      expect(hashPassword).toHaveBeenCalledWith('plainpassword');
      expect(result).toBe(true);
    });
  });

  describe('changePassword', () => {
    it('should verify old password and hash new password', async () => {
      const oldPasswordPlain = 'oldpass123';
      const newPasswordPlain = 'newpass456';
      const hashedOldPassword = await bcrypt.hash(oldPasswordPlain, 10);
      const hashedNewPassword = 'hashed_new_password';

      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        password: hashedOldPassword
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      User.findOne.mockResolvedValue(mockUser);
      hashPassword.mockResolvedValue(hashedNewPassword);
      User.findByIdAndUpdate.mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        password: hashedNewPassword
      });

      const result = await userService.changePassword(
        '507f1f77bcf86cd799439011',
        oldPasswordPlain,
        newPasswordPlain,
        mockResponse
      );

      expect(hashPassword).toHaveBeenCalledWith(newPasswordPlain);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: '507f1f77bcf86cd799439011' },
        { password: hashedNewPassword },
        { new: true }
      );
    });

    it('should reject invalid old password', async () => {
      const oldPasswordPlain = 'correctoldpass';
      const wrongPasswordPlain = 'wrongoldpass';
      const hashedOldPassword = await bcrypt.hash(oldPasswordPlain, 10);

      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        password: hashedOldPassword
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      User.findOne.mockResolvedValue(mockUser);

      await userService.changePassword(
        '507f1f77bcf86cd799439011',
        wrongPasswordPlain,
        'newpass456',
        mockResponse
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should hash new password before saving', async () => {
      const mockToken = 'valid-reset-token';
      const newPasswordPlain = 'newresetpass123';
      const hashedNewPassword = 'hashed_reset_password';

      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        password: 'old_hashed_password',
        passwordResetToken: mockToken,
        passwordResetExpires: Date.now() + 3600000,
        save: jest.fn().mockResolvedValue(true)
      };

      jwt.verify = jest.fn().mockReturnValue({ id: '507f1f77bcf86cd799439011' });
      User.findOne.mockResolvedValue(mockUser);
      hashPassword.mockResolvedValue(hashedNewPassword);

      await userService.resetPassword(mockToken, newPasswordPlain);

      expect(hashPassword).toHaveBeenCalledWith(newPasswordPlain);
      expect(mockUser.password).toBe(hashedNewPassword);
      expect(mockUser.passwordResetToken).toBeUndefined();
      expect(mockUser.passwordResetExpires).toBeUndefined();
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});

describe('Password Security Integration Tests', () => {
  it('should ensure password hash and verify cycle works', async () => {
    const plainPassword = 'testpassword123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    // Verify that the hashed password can be compared successfully
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    expect(isValid).toBe(true);

    // Verify that wrong passwords fail comparison
    const isInvalid = await bcrypt.compare('wrongpassword', hashedPassword);
    expect(isInvalid).toBe(false);
  });

  it('should ensure passwords are never stored in plain text', async () => {
    const plainPassword = 'plainpassword123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    // Hash should never equal plain text
    expect(hashedPassword).not.toBe(plainPassword);
    
    // Hash should always start with bcrypt identifier
    expect(hashedPassword).toMatch(/^\$2[aby]\$/);
  });
});