const userService = require('./user.service');
const Wishlist = require('./models/wishlist.model');
const User = require('./models/user.model');
const { response } = require('../util/response');
const { transValidation, responseStatus, errorCode } = require('../langs/vn');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const result = await userService.loginUser(userName, password);
    if (!result) {
      return res
        .status(401)
        .json(response(responseStatus.fail, 'Tên đăng nhập hoặc mật khẩu không chính xác'));
    }

    return res
      .status(200)
      .json(
        response(responseStatus.success, 'Đăng nhập thành công', result),
      );
  } catch (error) {
    return res
      .status(500)
      .json(response(responseStatus.fail, 'Lỗi hệ thống, vui lòng thử lại'));
  }
};

const register = async (req, res) => {
  try {
    const { userName, password, fullName: full_name, email, identity, phone } = req.body;

    const result = await userService.register(
      userName,
      password,
      full_name,
      email,
      identity,
      phone,
    );

    const verifyToken = await userService.sendVerifyLink(email);
    if (!verifyToken) {
      return res
        .status(500)
        .json(
          response(responseStatus.fail, 'Không thể gửi email xác thực, vui lòng thử lại'),
        );
    }

    return res
      .status(201)
      .json(
        response(responseStatus.success, 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản'),
      );
  } catch (error) {
    let statusCode = 500;
    let message = 'Lỗi hệ thống, vui lòng thử lại';

    if (error.message === 'USERNAME_EXISTS') {
      statusCode = 409;
      message = 'Tên đăng nhập đã tồn tại';
    } else if (error.message === 'EMAIL_EXISTS') {
      statusCode = 409;
      message = 'Email đã tồn tại';
    } else if (error.message === 'IDENTITY_EXISTS') {
      statusCode = 409;
      message = 'CCCD đã tồn tại';
    } else if (error.message === 'PHONE_EXISTS') {
      statusCode = 409;
      message = 'Số điện thoại đã tồn tại';
    }

    return res
      .status(statusCode)
      .json(response(responseStatus.fail, message));
  }
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
  try {
    const data = await userService.userList();

    return res
      .status(200)
      .json(
        response(responseStatus.success, 'Lấy danh sách người dùng thành công', data),
      );
  } catch (error) {
    return res
      .status(500)
      .json(response(responseStatus.fail, 'Lỗi hệ thống, vui lòng thử lại'));
  }
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
  try {
    const { id } = req.params;
    const result = await userService.addWishlist(req.idUser, id);

    return res
      .status(201)
      .json(
        response(responseStatus.success, 'Đã thêm vào danh sách yêu thích', result),
      );
  } catch (error) {
    let statusCode = 500;
    let message = 'Lỗi hệ thống, vui lòng thử lại';

    if (error.message === 'AUCTION_ALREADY_IN_WISHLIST') {
      statusCode = 409;
      message = 'Sản phẩm đã có trong danh sách yêu thích';
    }

    return res
      .status(statusCode)
      .json(response(responseStatus.fail, message));
  }
};

const removeWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.removeWishlist(req.idUser, id);

    if (!result.deletedCount) {
      return res
        .status(404)
        .json(response(responseStatus.fail, 'Không tìm thấy sản phẩm trong danh sách yêu thích'));
    }

    return res
      .status(200)
      .json(
        response(responseStatus.success, 'Đã xóa khỏi danh sách yêu thích', result),
      );
  } catch (error) {
    return res
      .status(500)
      .json(response(responseStatus.fail, 'Lỗi hệ thống, vui lòng thử lại'));
  }
};

const removeAllWishlist = async (req, res) => {
  try {
    const result = await userService.removeAllWishlist(req.idUser);

    return res
      .status(200)
      .json(
        response(responseStatus.success, `Đã xóa ${result.deletedCount} sản phẩm khỏi danh sách yêu thích`, result),
      );
  } catch (error) {
    return res
      .status(500)
      .json(response(responseStatus.fail, 'Lỗi hệ thống, vui lòng thử lại'));
  }
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

    // Check if user is already active (handle both boolean and string types)
    if (user.status === true || user.status === 'true') {
      return res
        .status(400)
        .json(response(responseStatus.fail, transValidation.active_account));
    }

    user.status = true; // Ensure boolean true for consistency
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

  // Check if user is already active (handle both boolean and string types)
  if (user.status === true || user.status === 'true') {
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
