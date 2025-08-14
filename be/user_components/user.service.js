const User = require('./models/user.model');
const Wishlist = require('./models/wishlist.model');
const Auction = require('../auction_component/models/bid.model');
const Order = require('../auction_component/models/order.model');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { formatPrice: _formatPrice, formatNumberWithVND } = require('../util/formatPrice');
const { checkExistUser } = require('../util/checkExist');
const { transValidation, responseStatus } = require('../langs/vn');
require('dotenv').config();
const { response } = require('../util/response');
const { hashPassword } = require('../util/helper');

const bcrypt = require('bcrypt');

const loginUser = async (userName, password) => {
  // Find user by username only (not password)
  // Support both boolean true and string 'true' for backwards compatibility
  const user = await User.findOne({
    user_name: userName?.toLowerCase(),
    $or: [
      { status: true },
      { status: 'true' },
    ],
  });

  if (user !== null) {
    let isPasswordValid = false;

    // Check if password is already hashed (starts with $2b$ or similar)
    if (user.password.startsWith('$2') && user.password.includes('$')) {
      // Password is hashed, use bcrypt compare
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Password is plain text (temporary backwards compatibility)
      // TODO: Remove this after all passwords are hashed
      isPasswordValid = (password === user.password);

      // Auto-migrate: hash the plain text password
      if (isPasswordValid) {
        const hashedPassword = await hashPassword(password);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
      }
    }

    if (isPasswordValid) {
      const payload = {
        idUser: user._id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(
        {
          payload,
        },
        process.env.JWT_SECRET,
        {
          algorithm: 'HS256',
          expiresIn: '1d',
        },
      );
      return {
        token,
        user: payload,
      };
    }
  }

  // Return null for invalid credentials
  return null;
};

const register = async (
  userName,
  password,
  full_name,
  email,
  identity,
  phone,
) => {
  try {
    const existingUser = await User.findOne({
      $or: [
        { user_name: userName.toLowerCase() },
        { email: email },
        { identity: identity },
        { phone: phone },
      ],
    });

    if (existingUser) {
      // Return specific field that conflicts
      if (existingUser.user_name === userName.toLowerCase()) {
        throw new Error('USERNAME_EXISTS');
      }
      if (existingUser.email === email) {
        throw new Error('EMAIL_EXISTS');
      }
      if (existingUser.identity === identity) {
        throw new Error('IDENTITY_EXISTS');
      }
      if (existingUser.phone === phone) {
        throw new Error('PHONE_EXISTS');
      }
    }

    const user = new User({
      user_name: userName.toLowerCase(),
      full_name: full_name,
      password: await hashPassword(password),
      email: email,
      identity: identity,
      phone: phone,
      status: false,
      role: 'user',
    });

    const savedUser = await user.save();
    return {
      success: true,
      user: {
        id: savedUser._id,
        userName: savedUser.user_name,
        email: savedUser.email,
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in register:', error.message);
    }
    throw error;
  }
};

const userUpdate = async (id, fullName, email, identity, phone, res) => {
  try {
    const emailExistError = await checkExistUser(
      'email',
      email,
      id,
      res,
      transValidation.email_exist,
    );
    const identityExistError = await checkExistUser(
      'identity',
      identity,
      id,
      res,
      transValidation.identity_exist,
    );
    const phoneExistError = await checkExistUser(
      'phone',
      phone,
      id,
      res,
      transValidation.phone_exist,
    );
    if (!emailExistError && !phoneExistError && !identityExistError) {
      return await User.findOneAndUpdate(
        {
          _id: id,
        },
        {
          full_name: fullName,
          email: email,
          identity: identity,
          phone: phone,
        },
        {
          new: true,
        },
      ).select('-password');
    }
  } catch (error) {
    // Log error for debugging but don't expose to client
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in userUpdate:', error.message);
    }
    throw error;
  }
};

const changePassword = async (id, oldPassword, newPassword, res) => {
  try {
    const userE = await User.findOne({ _id: id });
    if (!userE) {
      return res
        .status(400)
        .json(response(responseStatus.fail, transValidation.user_not_exist));
    }

    // Use bcrypt to verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, userE.password);
    if (!isOldPasswordValid) {
      return res
        .status(400)
        .json(response(responseStatus.fail, transValidation.password_fail));
    }

    // Hash the new password before saving
    const hashedNewPassword = await hashPassword(newPassword);

    return await User.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        password: hashedNewPassword,
      },
      { new: true },
    );
  } catch (error) {
    // Log error for debugging but don't expose to client
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in changePassword:', error.message);
    }
    throw error;
  }
};

const forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(transValidation.user_not_exist);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 1 * 60 * 60 * 1000;
    await user.save();

    // Check if email credentials are configured
    if (!process.env.MAIL_FROM || !process.env.MAIL_PASSWORD) {
      console.warn('Email credentials not configured. Password reset email not sent.');
      // Return success to client but don't send email
      return { message: 'If the email exists, a reset link has been sent.' };
    }

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        auth: {
          user: process.env.MAIL_FROM,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const result = await transporter.sendMail({
        from: '"Bidy - Sàn đấu giá số 1 Việt Nam" <bidviet.hotro@gmail.com>',
        to: email,
        subject: 'Lấy lại mật khẩu Bidy',
        text: ` Bạn nhận được email này vì chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. \n Hãy nhấn vào link bên dưới để đặt lại mật khẩu của bạn: \n ${process.env.CLIENT_URL}/reset-password?token=${token}&email=${email} \n Link sẽ hết hạn sau 1 giờ. \n Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
         `,
      });

      console.log(`Password reset email sent successfully to ${email}`);
      return result;
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError.message);
      // Don't throw here, just log the error and return success to client
      // The token is still saved in the database for manual verification
      return { message: 'Password reset request processed. If email is configured, a reset link has been sent.' };
    }
  } catch (error) {
    // Log error for debugging but don't expose to client
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in forgotPassword:', error.message);
    }
    throw error;
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decodedToken.id,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash the new password before saving
    user.password = await hashPassword(newPassword);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Check if email credentials are configured
    if (!process.env.MAIL_FROM || !process.env.MAIL_PASSWORD) {
      console.warn('Email credentials not configured. Password reset confirmation email not sent.');
      return { message: 'Password reset successful' };
    }

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        auth: {
          user: process.env.MAIL_FROM,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const result = await transporter.sendMail({
        from: '"Bidy - Sàn đấu giá số 1 Việt Nam" <bidviet.hotro@gmail.com>',
        to: user.email,
        subject: 'Đã đặt lại mật khẩu Bidy ',
        text: `Mật khẩu của bạn đã được đặt lại thành công. \nNếu bạn không phải là người thực hiện hãy liên hệ với chúng tôi ngay lập tức: bidviet.hotro@gmail.com. \nCảm ơn bạn đã sử dụng dịch vụ của chúng tôi.`,
      });

      console.log(`Password reset confirmation email sent to ${user.email}`);
      return result;
    } catch (emailError) {
      console.error('Failed to send password reset confirmation email:', emailError.message);
      // Password was reset successfully, email failure shouldn't affect that
      return { message: 'Password reset successful. Confirmation email could not be sent.' };
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in resetPassword:', error.message);
    }
    throw error;
  }
};

const viewProfile = async (id) => {
  return await User.findOne({ _id: id }).select('-password');
};

const userList = async () => {
  try {
    const data = await User.find();
    return data;
  } catch (error) {
    // Log error for debugging but don't expose to client
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in userList:', error.message);
    }
    throw error;
  }
};

const getTotalWishlist = async (id, limitNumber) => {
  const totalWishlist = await Wishlist.find({ user_id: id }).countDocuments();
  const totalPages = Math.ceil(totalWishlist / limitNumber);
  return { totalWishlist, totalPages };
};

const wishlist = async (user_id) => {
  try {
    const data = await Wishlist.find({ user_id, status: 'true' })
      .populate('auction_id')
      .exec();
    const filteredWishlist = data.filter(
      (item) => item.auction_id && item.auction_id._id,
    );

    return filteredWishlist;
  } catch (error) {
    // Log error for debugging but don't expose to client
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in wishlist:', error.message);
    }
    throw error;
  }
};

const addWishlist = async (user_id, auction_id) => {
  try {
    const existingWishlist = await Wishlist.findOne({
      user_id,
      auction_id,
      status: 'true',
    });

    if (existingWishlist) {
      throw new Error('AUCTION_ALREADY_IN_WISHLIST');
    }

    const wishlistItem = await Wishlist.create({
      user_id,
      auction_id,
      status: 'true',
    });

    return {
      success: true,
      wishlistItem,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in addWishlist:', error.message);
    }
    throw error;
  }
};

const removeWishlist = async (user_id, id) => {
  return await Wishlist.deleteOne({
    user_id,
    auction_id: id,
  });
};

const removeAllWishlist = async (user_id) => {
  return await Wishlist.deleteMany({ user_id });
};

const sendVerifyLink = async (email) => {
  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    // Check if email credentials are configured
    if (!process.env.MAIL_FROM || !process.env.MAIL_PASSWORD) {
      console.warn('Email credentials not configured. Verification email not sent.');
      // Still return token to allow registration to complete
      return token;
    }

    const verifyLink = `${process.env.SERVER_URL}/user/verify?token=${token}`;
    const resendLink = `${
      process.env.SERVER_URL
    }/resend-verify?email=${encodeURIComponent(email)}`;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      service: 'gmail',
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Bidy - Sàn đấu giá số 1 Việt Nam" <bidviet.hotro@gmail.com>',
      to: email,
      subject: 'Kích hoạt tài khoản Bidy ',
      html: `
        <p>Chào bạn,</p>
        <p>Click vào liên kết dưới đây để kích hoạt tài khoản:</p>
        <a href="${verifyLink}" target="_blank">${verifyLink}</a>
        <p><strong>Lưu ý:</strong> liên kết hết hạn sau 15 phút.</p>
        <p>Nếu hết hạn, <a href="${resendLink}" target="_blank">Gửi lại liên kết xác minh</a>.</p>
      `,
    });

    console.log(`Verification email sent successfully to ${email}`);
    return token;
  } catch (error) {
    console.error('Failed to send verification email:', error.message);

    // Generate token anyway to allow registration to complete
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    // Note: In production, you might want to queue this for retry
    return token;
  }
};

const getMonthlyUserStats = async (yearParam) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth is 0-indexed
  const targetYear = +yearParam || currentYear;

  const stats = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${targetYear}-01-01T00:00:00Z`),
          $lt: new Date(`${targetYear + 1}-01-01T00:00:00Z`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $cond: [
            { $lt: ['$_id.month', 10] },
            { $concat: ['0', { $toString: '$_id.month' }] },
            { $toString: '$_id.month' },
          ],
        },
        amount: '$count', // rename here for FE
      },
    },
    { $sort: { month: 1 } },
  ]);

  // Fill missing months
  const monthsLimit = targetYear === currentYear ? currentMonth : 12;
  const fullStats = Array.from({ length: monthsLimit }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return {
      month: `${targetYear}-${month}`,
      amount: 0,
    };
  });

  stats.forEach((stat) => {
    const index = fullStats.findIndex((item) =>
      item.month.endsWith(stat.month),
    );
    if (index !== -1) fullStats[index].amount = stat.amount;
  });

  return fullStats;
};

const getUserStats = async (userId) => {
  // SELL section
  const sellEnded = await Auction.find({ owner: userId, status: 'ended' });
  const sellHappening = await Auction.countDocuments({
    owner: userId,
    status: 'happening',
  });
  const sellInitial = await Auction.countDocuments({
    owner: userId,
    status: 'initial',
  });

  const totalRevenue = await Order.aggregate([
    { $match: { user_id: { $ne: userId } } }, // buyers only
    {
      $lookup: {
        from: 'bids',
        localField: 'bid_id',
        foreignField: '_id',
        as: 'bid',
      },
    },
    { $unwind: '$bid' },
    { $match: { 'bid.owner': userId } },
    {
      $group: {
        _id: null,
        total: { $sum: { $toDouble: '$price' } },
      },
    },
  ]);

  const highestAuction = sellEnded.reduce((max, bid) => {
    const price = parseFloat(bid.price) || 0;
    return price > max ? price : max;
  }, 0);

  // BUY section
  const orders = await Order.find({ user_id: userId, isPayment: true });
  const totalSpending = orders.reduce((sum, order) => {
    return sum + parseFloat(order.price || '0');
  }, 0);

  const _boughtBidIds = orders.map((o) => String(o.bid_id));
  const allBids = await Auction.find({ 'top_ownerships.user_id': userId });

  let bidAmount = 0;
  let boughtAmount = 0;
  let biddingAmount = 0;

  for (const bid of allBids) {
    const userBid = bid.top_ownerships.find(
      (t) => String(t.user_id) === String(userId),
    );
    if (!userBid) continue;

    // Sum up the highest bid amounts for this user across all auctions
    bidAmount += userBid.amount || 0;

    if (bid.status === 'ended') {
      const topUser = bid.top_ownerships[0];
      if (topUser && String(topUser.user_id) === String(userId)) {
        boughtAmount += 1;
      }
    } else if (bid.status === 'happening') {
      biddingAmount += 1;
    }
  }

  const followAmount = await Wishlist.countDocuments({ user_id: userId });

  return {
    sell: {
      totalRevenue:
        totalRevenue[0]?.total > 0 ? formatNumberWithVND(totalRevenue[0].total) : '0 VNĐ',
      highestAuction: highestAuction > 0 ? formatNumberWithVND(highestAuction) : '0 VNĐ',
      soldAmount: sellEnded?.length ?? 0,
      sellingAmount: sellHappening ?? 0,
      willSellAmount: sellInitial ?? 0,
    },
    buy: {
      totalSpending: totalSpending > 0 ? formatNumberWithVND(totalSpending) : '0 VNĐ',
      bidAmount: bidAmount > 0 ? formatNumberWithVND(bidAmount) : '0 VNĐ',
      boughtAmount,
      biddingAmount,
      followAmount,
    },
  };
};
module.exports = {
  resetPassword,
  loginUser,
  register,
  userUpdate,
  viewProfile,
  userList,
  changePassword,
  wishlist,
  addWishlist,
  removeWishlist,
  removeAllWishlist,
  getTotalWishlist,
  forgotPassword,
  sendVerifyLink,
  getMonthlyUserStats,
  getUserStats,
};
