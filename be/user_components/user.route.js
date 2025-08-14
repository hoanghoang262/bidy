const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authenMiddleware = require('../Middlewares/authen.middleware');
const { validationMiddlewares } = require('../Middlewares/validation.middleware');
const { rateLimiters, sanitizeInput } = require('../Middlewares/security.middleware');

// ===== PUBLIC ROUTES (No Authentication Required) =====

// User validation - Check if username/email/phone/identity exists
router.post('/check',
  sanitizeInput,
  userController.checkUser,
);

// Authentication routes
router.post('/login',
  rateLimiters.auth,
  sanitizeInput,
  validationMiddlewares.validateUserLogin,
  userController.loginUser,
);

router.post('/signup',
  rateLimiters.general,
  sanitizeInput,
  validationMiddlewares.validateUserRegister,
  userController.register,
);

// Password recovery routes
router.post('/forgot-password',
  rateLimiters.passwordReset,
  sanitizeInput,
  validationMiddlewares.validateForgotPassword,
  userController.forgotPassword,
);

router.post('/reset-password',
  rateLimiters.auth,
  sanitizeInput,
  validationMiddlewares.validateResetPassword,
  userController.resetPassword,
);

// Email verification routes
router.get('/verify',
  sanitizeInput,
  userController.verifyLink,
);

router.get('/resend-verify',
  sanitizeInput,
  userController.resendVerify,
);

// ===== PROTECTED ROUTES (Authentication Required) =====

// User profile management
router.get('/profile',
  sanitizeInput,
  authenMiddleware.isAuth,
  userController.viewProfile,
);

router.get('/stats',
  sanitizeInput,
  authenMiddleware.isAuth,
  userController.getUserStats,
);

router.patch('/update',
  sanitizeInput,
  authenMiddleware.isAuth,
  userController.userUpdate,
);

router.put('/changePassword',
  rateLimiters.auth,
  sanitizeInput,
  authenMiddleware.isAuth,
  validationMiddlewares.validateChangePassword,
  userController.changePassword,
);

// ===== WISHLIST ROUTES =====

router.get('/wishlist',
  sanitizeInput,
  authenMiddleware.isAuth,
  validationMiddlewares.validatePagination,
  userController.wishlist,
);

router.post('/wishlist/add/:id',
  sanitizeInput,
  authenMiddleware.isAuth,
  validationMiddlewares.validateMongoId,
  userController.addWishlist,
);

router.delete('/wishlist/remove/:id',
  sanitizeInput,
  authenMiddleware.isAuth,
  validationMiddlewares.validateMongoId,
  userController.removeWishlist,
);

router.delete('/wishlist/removeAll',
  sanitizeInput,
  authenMiddleware.isAuth,
  userController.removeAllWishlist,
);

// ===== ADMIN ROUTES =====

// Get all users (Admin only - should add admin middleware)
router.get('/',
  sanitizeInput,
  // TODO: Add admin authorization middleware
  userController.userList,
);

module.exports = router;
