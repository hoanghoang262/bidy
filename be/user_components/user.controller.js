const userService = require('./user.service');
const Wishlist = require('./models/wishlist.model');
const User = require('./models/user.model');
const { response } = require('../util/response');
const { transValidation, responseStatus, errorCode } = require('../langs/vn');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  const result = await userService.loginUser(userName, password);
  if (!result) {
    return res
      .status(500)
      .json(response(responseStatus.fail, transValidation.login_fail));
  }
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, result),
    );
};

const register = async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const full_name = req.body.fullName;
  const email = req.body.email;
  const identity = req.body.identity;
  const phone = req.body.phone;

  const status = await userService.register(
    userName,
    password,
    full_name,
    email,
    identity,
    phone,
  );
  if (!status) {
    return res
      .status(500)
      .json(response(responseStatus.fail, transValidation.email_exist));
  }
  const verifyToken = await userService.sendVerifyLink(email);
  if (!verifyToken) {
    return res
      .status(500)
      .json(
        response(responseStatus.fail, transValidation.send_verify_link_failed),
      );
  }
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.send_verify_link_success),
    );
};

const viewProfile = async (req, res) => {
  try {
    const status = await userService.viewProfile(req.idUser);
    if (!status) {
      return res
        .status(404)
        .json(response(responseStatus.fail, transValidation.not_found));
    }
    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, status),
      );
  } catch (error) {
    return res
      .status(500)
      .json(response(responseStatus.fail, transValidation.internal_error));
  }
};

const getUserStats = async (req, res) => {
  try {
    const data = await userService.getUserStats(req.idUser);
    if (!data) {
      return res
        .status(404)
        .json(response(responseStatus.fail, transValidation.not_found));
    }
    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, data),
      );
  } catch (error) {
    return res
      .status(500)
      .json(response(responseStatus.fail, transValidation.internal_error));
  }
};

const userUpdate = async (req, res) => {
  const { idUser } = req;
  const { fullName, email, identity, phone } = req.body;
  const status = await userService.userUpdate(
    idUser,
    fullName,
    email,
    identity,
    phone,
    res,
  );
  if (status) {
    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, status),
      );
  }
};

const changePassword = async (req, res, next) => {
  const oldPassword = req.body.old_password;
  const newPassword = req.body.new_password;

  try {
    const status = await userService.changePassword(
      req.idUser,
      oldPassword,
      newPassword,
      res,
    );

    if (status)
      return res
        .status(200)
        .json(
          response(
            responseStatus.success,
            transValidation.input_correct,
            status,
          ),
        );
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const status = await userService.forgotPassword(email);

    if (status)
      return res
        .status(200)
        .json(
          response(
            responseStatus.success,
            transValidation.input_correct,
            status,
          ),
        );
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    const status = await userService.resetPassword(token, newPassword);

    if (status)
      return res
        .status(200)
        .json(
          response(
            responseStatus.success,
            transValidation.input_correct,
            status,
          ),
        );
  } catch (error) {
    next(error);
  }
};

const userList = async (req, res) => {
  const data = await userService.userList();
  if (!data) {
    return res
      .status(200)
      .json(response(responseStatus.fail, transValidation.email_exist));
  }
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, data),
    );
};

const wishlist = async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.LIMIT_NUMBER;
  try {
    const wishlist = await Wishlist.find({
      user_id: req.idUser,
      status: 'true',
    })
      .populate('auction_id')
      .exec();

    const { totalWishlist, totalPages } = await userService.getTotalWishlist(
      req.idUser,
      limitNumber,
    );
    const result = {
      wishlist,
      totalWishlist,
      totalPages,
      currentPage: totalPages ? pageNumber : 0,
    };

    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, result),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        response(
          responseStatus.fail,
          transValidation.bad_request,
          errorCode.bad_request,
        ),
      );
  }
};

const addWishlist = async (req, res) => {
  const { id } = req.params;
  const data = await userService.addWishlist(req.idUser, id, res);

  if (data) {
    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, data),
      );
  }
};

const removeWishlist = async (req, res) => {
  const { id } = req.params;
  const data = await userService.removeWishlist(req.idUser, id);
  if (!data) {
    return res
      .status(400)
      .json(response(responseStatus.fail, transValidation.email_exist));
  }
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, data),
    );
};

const removeAllWishlist = async (req, res) => {
  const data = await userService.removeAllWishlist(req.idUser);
  if (!data) {
    return res
      .status(400)
      .json(response(responseStatus.fail, transValidation.email_exist));
  }
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, data),
    );
};

const checkUser = async (req, res) => {
  const { email, phone, identity, userName } = req.body;

  // Check which field is being validated
  const result = {
    exists: false,
    field: null,
    message: null,
  };

  if (userName) {
    const isExistUserName = await User.findOne({
      user_name: userName,
    });
    if (isExistUserName) {
      result.exists = true;
      result.field = 'userName';
      result.message = transValidation.user_name_exist;
    }
  }

  if (email) {
    const isExistEmail = await User.findOne({
      email,
    });
    if (isExistEmail) {
      result.exists = true;
      result.field = 'email';
      result.message = transValidation.email_exist;
    }
  }

  if (phone) {
    const isExistPhone = await User.findOne({
      phone,
    });
    if (isExistPhone) {
      result.exists = true;
      result.field = 'phone';
      result.message = transValidation.phone_exist;
    }
  }

  if (identity) {
    const isExistIdentity = await User.findOne({
      identity,
    });
    if (isExistIdentity) {
      result.exists = true;
      result.field = 'identity';
      result.message = transValidation.identity_exist;
    }
  }

  // Always return 200 with data indicating whether user exists
  return res
    .status(200)
    .json(response(responseStatus.success, result.message || transValidation.input_correct, result));
};

const verifyLink = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res
        .status(400)
        .json(response(responseStatus.fail, transValidation.user_not_exist));
    }

    if (user.status === true) {
      return res
        .status(400)
        .json(response(responseStatus.fail, transValidation.active_account));
    }

    user.status = true;
    await user.save();

    return res
      .status(200)
      .json(
        response(
          responseStatus.success,
          transValidation.active_account_successfully,
        ),
      );
  } catch (err) {
    return res
      .status(400)
      .json(response(responseStatus.fail, transValidation.invalid_link));
  }
};

const resendVerify = async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json(response(responseStatus.fail, transValidation.account_notfound));
  }

  if (user.status === true) {
    return res
      .status(200)
      .json(response(responseStatus.fail, transValidation.active_account));
  }

  await userService.sendVerifyLink(email);
  return res
    .status(200)
    .json(response(responseStatus.success, transValidation.sent_link));
};

module.exports = {
  verifyLink,
  checkUser,
  loginUser,
  register,
  resetPassword,
  userUpdate,
  viewProfile,
  userList,
  wishlist,
  changePassword,
  addWishlist,
  removeWishlist,
  removeAllWishlist,
  forgotPassword,
  resendVerify,
  getUserStats,
};
