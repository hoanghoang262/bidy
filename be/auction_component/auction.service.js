// Core dependencies
const _jwt = require('jsonwebtoken');
const _nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs/promises');

// Models
const Auction = require('./models/bid.model');
const Cart = require('./models/cart.model');
const Category = require('./models/category.model');
const Order = require('./models/order.model');
const User = require('../user_components/models/user.model');
const Wishlist = require('../user_components/models/wishlist.model');

// Utilities
const { s3: _s3, getPresignedUrl: _getPresignedUrl } = require('../util/aws.config');
const { cache, CACHE_KEYS, CACHE_TTL } = require('../util/cache');
const { formatPrice } = require('../util/formatPrice');
const { getPagination, getFilteredPaginatedData } = require('../util/pagination');
const filterAuctionEndWithTimeAgo = require('../util/filterAuctionEndWithTimeAgo');
const logger = require('../util/logger');

require('dotenv').config();

const getLinkImage = async (files) => {
  const results = await Promise.all(files.map((key) => getImageUrl(key)));
  return results;
};

async function getImageUrl(key) {
  try {
    const baseUrl = process.env.SERVER_URL || 'http://localhost:8001';
    const response = await fetch(`${baseUrl}/images?key=${key}`);
    const data = await response.json();
    if (data.length > 0) {
      return data[0].url;
    } else {
      return '';
    }
  } catch (error) {
    logger.error('Error getting presigned URL', error, { operation: 'getPresignedUrl' });
    return '';
  }
}

// getPresignedUrl is now imported from util/aws.config.js

// Pagination helpers - simplified with centralized utility
const getTotalOrder = async (id, limitNumber) => {
  const result = await getPagination(Order, { user_id: id }, limitNumber);
  return { totalOrder: result.totalCount, totalPages: result.totalPages };
};

const getTotalAuction = async (id, limitNumber) => {
  const result = await getPagination(Auction, { owner: id }, limitNumber);
  return { totalAuction: result.totalCount, totalPages: result.totalPages };
};

const getAllCategory = async () => {
  // Check cache first
  const cachedCategories = cache.get(CACHE_KEYS.CATEGORIES);
  if (cachedCategories) {
    return cachedCategories;
  }

  // If not in cache, fetch from database
  const data = await Category.find();

  // Store in cache for 1 hour (categories don't change frequently)
  cache.set(CACHE_KEYS.CATEGORIES, data, CACHE_TTL.CATEGORIES);

  return data;
};

const getProductBySearch = async (keyword, pageNumber, limitNumber) => {
  return await getFilteredPaginatedData({
    model: Auction,
    pageNumber,
    limitNumber,
    searchFields: ['name'],
    searchTerm: keyword,
    responseKeys: {
      data: 'auction',
      total: 'totalAuctions',
      totalPages: 'totalPages',
      currentPage: 'currentPage',
    },
  });
};

const getProductByCategory = async (category, pageNumber, limitNumber) => {
  const skip = (pageNumber - 1) * limitNumber;

  try {
    // Check cache first for category lookup
    const cacheKey = `category_${category}`;
    let categoryData = cache.get(cacheKey);

    if (!categoryData) {
      categoryData = await Category.findOne({ name: category });
      if (categoryData) {
        // Cache category for 30 minutes
        cache.set(cacheKey, categoryData, 1800000);
      }
    }

    if (!categoryData) {
      return null;
    }

    // Optimize: Use parallel queries for auction data and count
    const [auction, totalCount] = await Promise.all([
      Auction.find({ category: categoryData._id })
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limitNumber)
        .lean(), // Use lean() for better performance (returns plain objects)
      Auction.countDocuments({ category: categoryData._id }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    const response = {
      auction,
      totalAuctions: totalCount,
      totalPages,
      currentPage: totalPages ? pageNumber : 0,
    };
    return response;
  } catch (error) {
    logger.error('Service error', error);
  }
};

const getProductByStatus = async (status, pageNumber, limitNumber) => {
  const result = await getFilteredPaginatedData({
    model: Auction,
    filter: { status: status },
    pageNumber,
    limitNumber,
    populate: [{
      path: 'owner',
      select: 'full_name _id',
    }],
    responseKeys: {
      data: 'auction',
      total: 'totalAuctions',
      totalPages: 'totalPages',
      currentPage: 'currentPage',
    },
    lean: false,  // Need full documents for date checking
  });

  // Handle auction end logic
  const now = new Date();
  result.auction.forEach((i) => {
    if (i.finishedTime.getTime() <= now.getTime()) {
      eventBidEnd(i._id);
    }
  });

  return result;
};

const getUserProductByStatus = async (id, status, pageNumber, limitNumber) => {
  const result = await getFilteredPaginatedData({
    model: Auction,
    filter: { status, owner: id },
    pageNumber,
    limitNumber,
    populate: [{
      path: 'owner',
      select: 'full_name _id',
    }],
    responseKeys: {
      data: 'auction',
      total: 'totalAuctions',
      totalPages: 'totalPages',
      currentPage: 'currentPage',
    },
    lean: false,  // Need full documents for date checking
  });

  // Handle auction end logic
  const now = new Date();
  result.auction.forEach((i) => {
    if (i.finishedTime.getTime() <= now.getTime()) {
      eventBidEnd(i._id);
    }
  });

  return result;
};

const getAuctionUserBought = async (userId, pageNumber, limitNumber) => {
  return await getFilteredPaginatedData({
    model: Order,
    filter: { user_id: userId },
    pageNumber,
    limitNumber,
    populate: [{
      path: 'bid_id',
      populate: [
        {
          path: 'category',
          select: 'name',
        },
        {
          path: 'owner',
          select: 'full_name _id',
        },
      ],
    }],
    responseKeys: {
      data: 'orders',
      total: 'totalOrders',
      totalPages: 'totalPages',
      currentPage: 'currentPage',
    },
  });
};

const getAuctionUserSold = async (userId, pageNumber, limitNumber) => {
  return await getFilteredPaginatedData({
    model: Auction,
    filter: { owner: userId },
    pageNumber,
    limitNumber,
    populate: ['category'],  // Simplified population
    responseKeys: {
      data: 'auction',
      total: 'totalAuctions',
      totalPages: 'totalPages',
      currentPage: 'currentPage',
    },
  });
};

const getMonthlyAuctionStats = async (yearParam) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const targetYear = +yearParam || currentYear;
  const maxMonth = targetYear === currentYear ? now.getMonth() + 1 : 12;

  const stats = await Auction.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${targetYear}-01-01T00:00:00.000Z`),
          $lte: new Date(`${targetYear}-12-31T23:59:59.999Z`),
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },
                { $concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' },
              ],
            },
          ],
        },
        count: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  const fullStats = Array.from({ length: maxMonth }, (_, i) => {
    const month = `${targetYear}-${String(i + 1).padStart(2, '0')}`;
    const found = stats.find((s) => s.month === month);
    return {
      month,
      amount: found ? String(found.count) : '0',
    };
  });

  return fullStats;
};

const activeAutoBid = async () => {
  const auctions = await Auction.find({
    status: 'happenning',
    hasActiveAutoBid: true,
  });

  let text = 'stop';

  for (const auc of auctions) {
    const highestOwner = auc.top_ownerships.sort(
      (a, b) => b.amount - a.amount,
    )?.[0];

    const sortedAutoOwners = auc.top_ownerships
      .filter((owner) => owner.isAuto)
      .sort((a, b) => b.limitBid - a.limitBid);

    if (sortedAutoOwners.length === 0) continue;

    if (sortedAutoOwners.length === 1) {
      const autoOwner = sortedAutoOwners[0];
      if (highestOwner && highestOwner.user_id !== autoOwner.user_id) {
        const newAmount = Math.round(
          (highestOwner.amount * +`1${process.env.PERCENT_AUTOBID}`) / 100,
        );
        if (newAmount > autoOwner.limitBid) continue;
        await Auction.updateOne(
          { _id: auc._id, 'top_ownerships.user_id': autoOwner.user_id },
          { $set: { 'top_ownerships.$.amount': newAmount } },
        );
        text = `Đã cập nhật giá tự động sản phẩm ${auc.name} - với người dùng ${autoOwner.user_name}`;
      }
      continue;
    }

    const autoOwner = sortedAutoOwners[0];
    const secondAutoOwner = sortedAutoOwners[1];

    if (highestOwner.user_id !== autoOwner.user_id) {
      const newAmount = Math.round(
        ((highestOwner.amount > secondAutoOwner.limitBid
          ? highestOwner.amount
          : secondAutoOwner.limitBid) *
          +`1${process.env.PERCENT_AUTOBID}`) /
          100,
      );

      if (autoOwner.limitBid > newAmount) {
        await Auction.updateOne(
          { _id: auc._id, 'top_ownerships.user_id': autoOwner.user_id },
          { $set: { 'top_ownerships.$.amount': newAmount } },
        );
      }
    } else {
      for (const owner of sortedAutoOwners.filter(
        (i) => i.user_id !== highestOwner.user_id,
      )) {
        await Auction.updateOne(
          { _id: auc._id, 'top_ownerships.user_id': owner.user_id },
          { $set: { 'top_ownerships.$.isAuto': false } },
        );
        text = `Đã gỡ đấu giá tự động sản phẩm ${auc.name} - với người dùng ${owner.user_name} vì đã vượt quá giới hạn`;
      }
    }
  }

  return text;
};

const getAuctionEnd = async (pageNumber, limitNumber) => {
  const skip = (pageNumber - 1) * limitNumber;
  const auction = await Auction.find({ status: 'end' })
    .skip(skip)
    .limit(limitNumber);
  const auctionTenMinutes = filterAuctionEndWithTimeAgo(auction, 10);

  const totalAuctions = auctionTenMinutes.length;
  const totalPages = Math.ceil(totalAuctions / limitNumber);

  const response = {
    auction: auctionTenMinutes,
    totalAuctions,
    totalPages,
    currentPage: totalPages ? pageNumber : 0,
  };
  return response;
};

const getProductById = async (id) => {
  const data = await Auction.findOne({ _id: id }).populate([
    {
      path: 'top_ownerships.user_id',
      select: 'full_name _id', // optional select here too
    },
    {
      path: 'owner',
      select: 'full_name _id',
    },
  ]);
  return data;
};
const updateProduct = async (id, body) => {
  const auction = await Auction.findOne({ _id: id });
  if (!auction) {
    return null;
  }
  const stringImages = Array.isArray(body.image)
    ? body.image
    : body.image
    ? [body.image]
    : [];

  const uploadedImageKeys = await Promise.all(
    (body.files || []).map(uploadToJsonServer),
  );

  const imagesKeys = [...stringImages, ...uploadedImageKeys];

  return await Auction.findOneAndUpdate(
    { _id: id },
    {
      name: body.name,
      price: body.price,
      priceBuyNow: body.priceBuyNow,
      category: body.category,
      description: body.description,
      finishedTime: body.finishedTime,
      image: imagesKeys,
    },
    { new: true },
  );
};

const uploadToJsonServer = async (file) => {
  const fileName = `${Date.now()}_${Math.random() * 1e9}_${file.originalname}`;
  const filePath = path.join(__dirname, '../uploads', fileName);

  await fs.writeFile(filePath, file.buffer);

  const url = `/uploads/${fileName}`;

  const key = fileName;
  await fetch(`${process.env.SERVER_URL || 'http://localhost:8001'}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, url }),
  });
  return key;
};

const viewCart = async (id) => {
  const data = await Cart.find({ user_id: id, status: 'unpaid' });
  const cartData = [];
  for (let i = 0; i < data.length; i++) {
    const bidData = await Auction.findOne({ _id: data[i].bid_id });
    cartData.push({
      cart: data[i],
      productInfor: bidData,
    });
  }
  return cartData;
};

const deleteMyAuction = async (id, user_id) => {
  const data = await Auction.find({
    owner: user_id,
    _id: id,
    status: 'happenning',
  });
  if (!data) {
    return;
  }
  await Auction.deleteOne({ _id: id });
  await Wishlist.deleteMany({ auction_id: id });
  return data;
};

const addBid = async (id, OwnershipData, hasActiveAutoBid) => {
  return await Auction.updateOne(
    {
      _id: id,
    },
    {
      $set: { hasActiveAutoBid },
      $push: { top_ownerships: OwnershipData },
    },
  );
};

const updateBid = async (id, OwnershipData) => {
  return await Auction.updateOne(
    {
      _id: id,
      'top_ownerships.user_id': OwnershipData.user_id,
    },
    {
      $set: { 'top_ownerships.$.amount': OwnershipData.amount },
    },
  );
};

const auctionBid = async (id, idUser, amount) => {
  try {
    const data = await Auction.findOne({ _id: id });
    if (!data) {
      return;
    }

    if (data.owner.toString() === idUser) {
      return;
    }
    const currentTime = new Date();
    const finishedTime = new Date(data.finishedTime);
    const threeMinutesBefore = new Date(finishedTime.getTime() - 3 * 60 * 1000);

    if (currentTime >= threeMinutesBefore) {
      const updatedFinishedTime = new Date(
        currentTime.getTime() + 3 * 60 * 1000,
      );
      await Auction.updateOne(
        { _id: id },
        { status: 'happenning', finishedTime: updatedFinishedTime },
      );
    }

    const topOwnerships = data.top_ownerships;
    const userE = await User.findOne({ _id: idUser });
    const OwnershipData = {
      user_id: idUser,
      user_name: userE.user_name,
      amount: amount,
    };

    return topOwnerships?.find((i) => i.user_id.toString() === idUser)
      ? await updateBid(id, OwnershipData)
      : await addBid(id, OwnershipData, true);
  } catch (error) {
    logger.error('Service error', error);
  }
};

const buyNow = async (id, idUser) => {
  try {
    const data = await Auction.findOne({ _id: id });
    if (!data) {
      return;
    }
    if (data.owner.toString() === idUser) {
      return;
    }
    const userE = await User.findOne({ _id: idUser });
    const ownershipData = {
      user_id: idUser,
      user_name: userE.user_name,
      amount: data.priceBuyNow,
    };

    await Auction.updateOne(
      {
        _id: id,
      },
      {
        $push: { top_ownerships: ownershipData },
        status: 'end',
        finishedTime: new Date(),
      },
    );

    const cart = new Cart({
      bid_id: data._id,
      user_id: userE._id,
      status: 'unpaid',
    });

    await sendEmail(
      userE.email,
      `Chúc mừng ${userE.full_name} đã đấu giá thành công!`,
      `Cảm ơn bạn đã tham gia đấu giá sản phẩm ${
        data.name
      }, bạn đã đấu giá thành công sản phẩm với giá là ${formatPrice(
        data.priceBuyNow,
      )} VNĐ!`,
      `Bạn có 3 ngày tính từ thời điểm này để hoàn tất thành toán, Xin cảm ơn!`,
    );
    return await cart.save();
  } catch (error) {
    logger.error('Service error', error);
  }
};

const autoBid = async (id, idUser, limitBid) => {
  try {
    const data = await Auction.findById(id);

    if (!data || data.owner.toString() === idUser) {
      return;
    }

    const currentTime = new Date();
    const finishedTime = new Date(data.finishedTime);
    const threeMinutesBefore = new Date(finishedTime.getTime() - 3 * 60 * 1000);

    if (currentTime >= threeMinutesBefore) {
      const updatedFinishedTime = new Date(
        currentTime.getTime() + 3 * 60 * 1000,
      );
      await Auction.updateOne(
        { _id: id },
        { status: 'happenning', finishedTime: updatedFinishedTime },
      );
    }

    const userE = await User.findOne({ _id: idUser });

    if (!userE) {
      return;
    }

    const topOwnerships = data.top_ownerships;

    const maxLimitBid = Math.max(
      ...topOwnerships.map((item) => item.limitBid || 0),
    );
    const maxAmount = Math.max(
      ...topOwnerships.map((item) => item.amount || 0),
    );

    const isMyTopBidNow =
      topOwnerships?.length &&
      topOwnerships.find((i) => i.user_id.toString() === idUser)?.amount ===
        maxAmount;

    const amountAfter =
      maxLimitBid && limitBid >= maxLimitBid ? maxLimitBid : maxAmount;

    const ownershipData = {
      user_id: idUser,
      user_name: userE.user_name,
      amount:
        ((topOwnerships.length ? amountAfter : data.price) *
          +`1${process.env.PERCENT_AUTOBID}`) /
        100,
      isAuto: true,
      limitBid,
    };

    return data.top_ownerships?.find((i) => i.user_id.toString() === idUser)
      ? await Auction.updateOne(
          {
            _id: id,
            'top_ownerships.user_id': idUser,
          },
          {
            $set: {
              hasActiveAutoBid: true,
              'top_ownerships.$.amount': isMyTopBidNow
                ? maxAmount
                : ownershipData.amount,
              'top_ownerships.$.isAuto': true,
              'top_ownerships.$.limitBid': limitBid,
            },
          },
        )
      : await addBid(id, ownershipData, true);
  } catch (error) {
    logger.error('Service error', error);
  }
};

const listingAuction = async (product, user_id) => {
  try {
    logger.info('Starting auction creation', { productName: product.name, userId: user_id, imageCount: product.image.length });

    // Process uploaded files
    const keyImages = [];
    for (const file of product.image) {
      logger.debug('Processing image file', { fileName: file.originalname, index: keyImages.length });
      const key = await uploadToJsonServer(file);
      keyImages.push(key);
      logger.debug('Image file processed successfully', { key, fileName: file.originalname });
    }

    logger.info('All image files processed successfully', { totalFiles: keyImages.length, productName: product.name });

    const auction = new Auction({
      name: product.name,
      owner: user_id,
      quantity: product.quantity,
      price: product.price,
      priceBuyNow: product.priceBuyNow,
      category: product.category,
      time_remain: product.time_remain,
      description: product.description,
      finishedTime: product.finishedTime,
      image: keyImages,
      status: 'happenning',
    });

    logger.debug('Saving auction to database', { productName: product.name, userId: user_id });
    await auction.save();
    logger.info('Auction saved successfully', { auctionId: auction._id, productName: product.name, userId: user_id });
    return auction; // <-- Return the created auction
  } catch (error) {
    logger.error('Error creating auction', error, { productName: product.name, userId: user_id });
    return null; // Return null on error
  }
};

const eventBidEnd = async (id) => {
  try {
    const [bid, isExistOrder] = await Promise.all([
      getProductById(id),
      Order.findOne({ bid_id: id }),
    ]);

    if (!bid.top_ownerships.length) {
      // cap nhat them 1 ngay
      return await Auction.updateOne(
        { _id: id },
        {
          finishedTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'happenning',
        },
      );
    }
    if (isExistOrder) return;

    await Auction.updateOne(
      { _id: id },
      {
        status: 'ended',
        finishedTime: new Date(),
        bidHideTime: new Date(bid.finishedTime.getTime() + 10 * 60 * 1000),
      },
    );
    const [maxOwner, ...bidFail] = bid.top_ownerships.sort(
      (a, b) => b.amount - a.amount,
    );

    // const [isExistInCart, cart, owner] = await Promise.all([
    //   Cart.findOne({ bid_id: bid._id, user_id: maxOwner.user_id._id }),
    //   new Cart({
    //     bid_id: bid._id,
    //     user_id: maxOwner.user_id._id,
    //     status: "unpaid",
    //   }),
    //   User.findOne({ _id: bid.owner }),
    // ]);

    // if (isExistInCart) return;

    // await cart.save();

    // Get the owner for the email notification
    const owner = await User.findOne({ _id: bid.owner });
    if (!owner) return;

    await sendEmail(
      owner.email,
      `Chúc mừng ${owner.full_name} đã có sản phẩm được đấu giá thành công!`,
      `Sản phẩm ${
        bid.name
      } đã có người đấu giá thành công, bạn đã có sản phẩm đấu giá thành công sản phẩm với giá là ${formatPrice(
        maxOwner.amount,
      )} VNĐ!`,
      `Chúng tôi sẽ sớm liên hệ lại với bạn! Xin cảm ơn`,
    );

    await sendEmail(
      maxOwner.user_id.email,
      `Chúc mừng ${maxOwner.user_id.full_name} đã đấu giá thành công!`,
      `Cảm ơn bạn đã tham gia đấu giá sản phẩm ${
        bid.name
      }, bạn đã đấu giá thành công sản phẩm với giá là ${formatPrice(
        maxOwner.amount,
      )} VNĐ!`,
      `Bạn có 3 ngày tính từ thời điểm này để hoàn tất thanh toán ! Xin cảm ơn`,
    );

    for (const u of bidFail) {
      await sendEmail(
        u.user_id.email,
        `Rất tiếc ${u.user_id.full_name} đã không đấu giá thành công!`,
        `Cảm ơn bạn đã tham gia đấu giá sản phẩm ${bid.name}, bạn đã không đấu giá thành công sản phẩm!`,
        `Bạn có thể tham gia đấu giá sản phẩm khác! Xin cảm ơn`,
      );
    }
  } catch (error) {
    logger.error('Error in bid end event', error, { auctionId: id });
  }
};

const eventCheckout = async (user_id) => {
  try {
    // Find all unpaid carts for the user
    const carts = await Cart.find({ user_id, status: 'unpaid' });
    const orders = [];
    for (const cart of carts) {
      // Create an order for each cart item
      const order = await Order.create({
        user_id: cart.user_id,
        bid_id: cart.bid_id,
        price: cart.price,
        isPayment: true,
      });
      orders.push(order);
      // Remove the cart item
      await Cart.findByIdAndDelete(cart._id);
    }
    return orders;
  } catch (error) {
    logger.error('Error in checkout event', error, { userId: user_id });
    return null;
  }
};

// Basic sendEmail function for development/testing
const sendEmail = (to, subject, _text, _html) => {
  logger.info('Sending email', { to, subject });
  logger.debug('Email service integration needed for production', { to, subject });
};

module.exports = {
  getUserProductByStatus,
  buyNow,
  activeAutoBid,
  autoBid,
  sendEmail,
  getAuctionEnd,
  getProductByCategory,
  getProductById,
  auctionBid,
  listingAuction,
  eventBidEnd,
  getProductBySearch,
  getAllCategory,
  eventCheckout,
  getLinkImage,
  getProductByStatus,
  viewCart,
  getTotalOrder,
  getTotalAuction,
  deleteMyAuction,
  updateProduct,
  getAuctionUserBought,
  getAuctionUserSold,
  getMonthlyAuctionStats,
};