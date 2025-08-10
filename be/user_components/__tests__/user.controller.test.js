const userController = require('../user.controller');
const userService = require('../user.service');
const Wishlist = require('../models/wishlist.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../user.service');
jest.mock('../models/wishlist.model');
jest.mock('../models/user.model');
jest.mock('jsonwebtoken');
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

describe('User Controller Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: {},
      params: {},
      query: {},
      idUser: 'test-user-id'
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
    
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('loginUser', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginData = {
        token: 'test-token',
        user: { id: '123', userName: 'testuser' }
      };

      mockReq.body = {
        userName: 'testuser',
        password: 'password123'
      };

      userService.loginUser.mockResolvedValue(loginData);

      await userController.loginUser(mockReq, mockRes);

      expect(userService.loginUser).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: expect.any(String),
          data: loginData
        })
      );
    });

    it('should return 500 when login fails', async () => {
      mockReq.body = {
        userName: 'testuser',
        password: 'wrongpassword'
      };

      userService.loginUser.mockResolvedValue(null);

      await userController.loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: expect.any(String)
        })
      );
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      mockReq.body = {
        userName: 'newuser',
        password: 'password123',
        fullName: 'New User',
        email: 'newuser@example.com',
        identity: '123456789',
        phone: '0987654321'
      };

      userService.register.mockResolvedValue(true);
      userService.sendVerifyLink.mockResolvedValue('verify-token');

      await userController.register(mockReq, mockRes);

      expect(userService.register).toHaveBeenCalledWith(
        'newuser',
        'password123',
        'New User',
        'newuser@example.com',
        '123456789',
        '0987654321'
      );
      expect(userService.sendVerifyLink).toHaveBeenCalledWith('newuser@example.com');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: expect.any(String)
        })
      );
    });

    it('should return 500 when registration fails', async () => {
      mockReq.body = {
        userName: 'existinguser',
        password: 'password123',
        fullName: 'Existing User',
        email: 'existing@example.com',
        identity: '123456789',
        phone: '0987654321'
      };

      userService.register.mockResolvedValue(false);

      await userController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: expect.any(String)
        })
      );
    });

    it('should return 500 when verify link sending fails', async () => {
      mockReq.body = {
        userName: 'newuser',
        password: 'password123',
        fullName: 'New User',
        email: 'newuser@example.com',
        identity: '123456789',
        phone: '0987654321'
      };

      userService.register.mockResolvedValue(true);
      userService.sendVerifyLink.mockResolvedValue(null);

      await userController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: expect.any(String)
        })
      );
    });
  });

  describe('viewProfile', () => {
    it('should return user profile successfully', async () => {
      const profileData = {
        id: 'test-user-id',
        userName: 'testuser',
        email: 'test@example.com'
      };

      userService.viewProfile.mockResolvedValue(profileData);

      await userController.viewProfile(mockReq, mockRes);

      expect(userService.viewProfile).toHaveBeenCalledWith('test-user-id');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: profileData
        })
      );
    });

    it('should return 404 when user not found', async () => {
      userService.viewProfile.mockResolvedValue(null);

      await userController.viewProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: expect.any(String)
        })
      );
    });

    it('should return 500 on service error', async () => {
      userService.viewProfile.mockRejectedValue(new Error('Service error'));

      await userController.viewProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fail',
          message: expect.any(String)
        })
      );
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics successfully', async () => {
      const statsData = {
        totalBids: 5,
        totalWon: 2,
        totalLost: 3
      };

      userService.getUserStats.mockResolvedValue(statsData);

      await userController.getUserStats(mockReq, mockRes);

      expect(userService.getUserStats).toHaveBeenCalledWith('test-user-id');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: statsData
        })
      );
    });

    it('should return 404 when stats not found', async () => {
      userService.getUserStats.mockResolvedValue(null);

      await userController.getUserStats(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should return 500 on service error', async () => {
      userService.getUserStats.mockRejectedValue(new Error('Service error'));

      await userController.getUserStats(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      mockReq.body = {
        old_password: 'oldpass',
        new_password: 'newpass'
      };

      userService.changePassword.mockResolvedValue(true);

      await userController.changePassword(mockReq, mockRes, mockNext);

      expect(userService.changePassword).toHaveBeenCalledWith(
        'test-user-id',
        'oldpass',
        'newpass',
        mockRes
      );
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password email successfully', async () => {
      mockReq.body = { email: 'user@example.com' };

      userService.forgotPassword.mockResolvedValue(true);

      await userController.forgotPassword(mockReq, mockRes, mockNext);

      expect(userService.forgotPassword).toHaveBeenCalledWith('user@example.com');
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      mockReq.body = {
        token: 'reset-token',
        newPassword: 'newpassword'
      };

      userService.resetPassword.mockResolvedValue(true);

      await userController.resetPassword(mockReq, mockRes, mockNext);

      expect(userService.resetPassword).toHaveBeenCalledWith('reset-token', 'newpassword');
    });
  });

  describe('wishlist', () => {
    it('should return user wishlist successfully', async () => {
      const wishlistData = [
        { id: '1', name: 'Product 1' },
        { id: '2', name: 'Product 2' }
      ];

      Wishlist.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(wishlistData)
        })
      });

      userService.getTotalWishlist = jest.fn().mockResolvedValue({
        totalWishlist: 2,
        totalPages: 1
      });

      await userController.wishlist(mockReq, mockRes);

      expect(Wishlist.find).toHaveBeenCalledWith({ 
        user_id: 'test-user-id',
        status: 'true'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: expect.objectContaining({
            wishlist: wishlistData,
            totalWishlist: 2,
            totalPages: 1
          })
        })
      );
    });

    it('should return empty array when no wishlist items found', async () => {
      Wishlist.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([])
        })
      });

      await userController.wishlist(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: []
        })
      );
    });

    it('should return 500 on database error', async () => {
      Wishlist.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error('Database error'))
        })
      });

      await userController.wishlist(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('addWishlist', () => {
    it('should add item to wishlist successfully', async () => {
      mockReq.body = { auctionId: 'auction-123' };

      Wishlist.create.mockResolvedValue({
        user: 'test-user-id',
        auction: 'auction-123'
      });

      await userController.addWishlist(mockReq, mockRes);

      expect(Wishlist.create).toHaveBeenCalledWith({
        user: 'test-user-id',
        auction: 'auction-123'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 on database error', async () => {
      mockReq.body = { auctionId: 'auction-123' };

      Wishlist.create.mockRejectedValue(new Error('Database error'));

      await userController.addWishlist(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('removeWishlist', () => {
    it('should remove item from wishlist successfully', async () => {
      mockReq.body = { auctionId: 'auction-123' };

      Wishlist.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await userController.removeWishlist(mockReq, mockRes);

      expect(Wishlist.deleteOne).toHaveBeenCalledWith({
        user: 'test-user-id',
        auction: 'auction-123'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('removeAllWishlist', () => {
    it('should remove all wishlist items successfully', async () => {
      Wishlist.deleteMany.mockResolvedValue({ deletedCount: 5 });

      await userController.removeAllWishlist(mockReq, mockRes);

      expect(Wishlist.deleteMany).toHaveBeenCalledWith({ user: 'test-user-id' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('checkUser', () => {
    it('should return exists: true when username exists', async () => {
      mockReq.body = {
        userName: 'existinguser'
      };

      User.findOne.mockResolvedValueOnce({ user_name: 'existinguser' });

      await userController.checkUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: expect.objectContaining({
            exists: true,
            field: 'userName'
          })
        })
      );
    });

    it('should return exists: false when user does not exist', async () => {
      mockReq.body = {
        userName: 'newuser',
        email: 'new@example.com'
      };

      User.findOne.mockResolvedValue(null);

      await userController.checkUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: expect.objectContaining({
            exists: false
          })
        })
      );
    });

    it('should check by email when only email provided', async () => {
      mockReq.body = { email: 'test@example.com' };

      User.findOne.mockResolvedValue(null);

      await userController.checkUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
    });

    it('should check by username when only username provided', async () => {
      mockReq.body = { userName: 'testuser' };

      User.findOne.mockResolvedValue(null);

      await userController.checkUser(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({
        user_name: 'testuser'
      });
    });
  });

  describe('verifyLink', () => {
    it('should verify user successfully with valid token', async () => {
      mockReq.query = { token: 'valid-token' };

      jwt.verify.mockReturnValue({ email: 'user@example.com' });
      User.findOneAndUpdate.mockResolvedValue({
        email: 'user@example.com',
        emailVerified: true
      });

      await userController.verifyLink(mockReq, mockRes);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { email: 'user@example.com' },
        { emailVerified: true },
        { new: true }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 with invalid token', async () => {
      mockReq.query = { token: 'invalid-token' };

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await userController.verifyLink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when no token provided', async () => {
      mockReq.query = {};

      await userController.verifyLink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('resendVerify', () => {
    it('should resend verification email successfully', async () => {
      mockReq.query = { email: 'user@example.com' };

      userService.sendVerifyLink.mockResolvedValue('new-token');

      await userController.resendVerify(mockReq, mockRes);

      expect(userService.sendVerifyLink).toHaveBeenCalledWith('user@example.com');
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when no email provided', async () => {
      mockReq.query = {};

      await userController.resendVerify(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 500 when sending fails', async () => {
      mockReq.query = { email: 'user@example.com' };

      userService.sendVerifyLink.mockResolvedValue(null);

      await userController.resendVerify(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});