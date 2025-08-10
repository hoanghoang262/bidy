const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authenMiddleware = require("../Middlewares/authen.middleware");
const { validationMiddlewares } = require("../Middlewares/validation.middleware");
const { rateLimiters, sanitizeInput } = require("../Middlewares/security.middleware");

router.post("/check", userController.checkUser);
router.post("/login", 
  rateLimiters.auth, 
  sanitizeInput, 
  validationMiddlewares.validateUserLogin, 
  userController.loginUser);
router.post("/signup", 
  rateLimiters.general, 
  sanitizeInput, 
  validationMiddlewares.validateUserRegister, 
  userController.register);
router.get("/profile", 
  sanitizeInput, 
  authenMiddleware.isAuth, 
  userController.viewProfile);
router.get("/stats", 
  sanitizeInput, 
  authenMiddleware.isAuth, 
  userController.getUserStats);
router.patch("/update", authenMiddleware.isAuth, userController.userUpdate);
router.post("/forgot-password", 
  rateLimiters.passwordReset, 
  sanitizeInput, 
  validationMiddlewares.validateForgotPassword, 
  userController.forgotPassword);
router.post("/reset-password", 
  rateLimiters.auth, 
  sanitizeInput, 
  validationMiddlewares.validateResetPassword, 
  userController.resetPassword);
router.get("/resend-verify", userController.resendVerify);
router.get("/verify", userController.verifyLink);
router.put(
  "/changePassword",
  rateLimiters.auth,
  sanitizeInput,
  authenMiddleware.isAuth,
  validationMiddlewares.validateChangePassword,
  userController.changePassword
);
router.get("/wishlist", 
  sanitizeInput, 
  authenMiddleware.isAuth, 
  validationMiddlewares.validatePagination, 
  userController.wishlist);
router.post(
  "/wishlist/add/:id",
  sanitizeInput,
  authenMiddleware.isAuth,
  validationMiddlewares.validateMongoId,
  userController.addWishlist
);
router.delete(
  "/wishlist/remove/:id",
  sanitizeInput,
  authenMiddleware.isAuth,
  validationMiddlewares.validateMongoId,
  userController.removeWishlist
);
router.delete(
  "/wishlist/removeAll",
  authenMiddleware.isAuth,
  userController.removeAllWishlist
);

//admin
router.get("/", userController.userList);

module.exports = router;

//forgotpassword gửi mail xác nhận
//gửi mail register
