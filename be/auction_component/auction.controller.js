const auctionService = require('./auction.service');
const { response } = require('../util/response');
const { transValidation, responseStatus, errorCode } = require('../langs/vn');
const Order = require('./models/order.model');
const _Cart = require('./models/cart.model');
const Auction = require('./models/bid.model');
const _nodemailer = require('nodemailer');
const { startCronJob } = require('../cronJob');
const logger = require('../util/logger');
const mongoose = require('mongoose');

const getAllCategory = async (req, res) => {
  try {
    const data = await auctionService.getAllCategory();
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
    logger.error('Error in getAllCategory', error, { function: 'getAllCategory' });
    return res
      .status(500)
      .json(response(responseStatus.fail, transValidation.server_error));
  }
};

const getAuctionByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const { page, limit } = req.query;
    const pageNumber = +page || +process.env.PAGE_NUMBER;
    const limitNumber = +limit || +process.env.LIMIT_NUMBER;
    const data = await auctionService.getProductByStatus(
      status,
      pageNumber,
      limitNumber,
    );

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
      .json(response(responseStatus.fail, transValidation.server_error));
  }
};

const getUserAuctionByStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    const { page, limit } = req.query;
    const pageNumber = +page || +process.env.PAGE_NUMBER;
    const limitNumber = +limit || +process.env.LIMIT_NUMBER;
    const data = await auctionService.getUserProductByStatus(
      id,
      status,
      pageNumber,
      limitNumber,
    );

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
      .json(response(responseStatus.fail, transValidation.server_error));
  }
};

const getAuctionUserBought = async (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.LIMIT_NUMBER;
  const data = await auctionService.getAuctionUserBought(
    id,
    pageNumber,
    limitNumber,
  );

  if (!data) {
    return res
      .status(200)
      .json(response(responseStatus.success, transValidation.not_found));
  }
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, data),
    );
};
const getAuctionUserSold = async (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.LIMIT_NUMBER;
  const data = await auctionService.getAuctionUserSold(
    id,
    pageNumber,
    limitNumber,
  );

  if (!data) {
    return res
      .status(200)
      .json(response(responseStatus.success, transValidation.not_found));
  }
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, data),
    );
};

const _getAuctionUserBidding = async (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.LIMIT_NUMBER;
  const data = await auctionService.getAuctionUserBidding(
    id,
    pageNumber,
    limitNumber,
  );

  if (!data) {
    return res
      .status(200)
      .json(response(responseStatus.success, transValidation.not_found));
  }
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, data),
    );
};

const getAuctionEnd = async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.LIMIT_NUMBER;
  const data = await auctionService.getAuctionEnd(pageNumber, limitNumber);

  if (!data) {
    return res
      .status(200)
      .json(response(responseStatus.success, transValidation.not_found));
  }

  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, data),
    );
};

const getProductByCategory = async (req, res) => {
  const { category } = req.params;
  const { page, limit } = req.query;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.LIMIT_NUMBER;

  const data = await auctionService.getProductByCategory(
    category,
    pageNumber,
    limitNumber,
  );
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, data),
    );
};

const getProductBySearch = async (req, res) => {
  const { page, limit } = req.query;
  const keyword = req.params.keyword;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.LIMIT_NUMBER;
  const data = await auctionService.getProductBySearch(
    keyword,
    pageNumber,
    limitNumber,
  );
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, data),
    );
};

const getProductById = async (req, res) => {
  const id = req.params.id;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json(response(responseStatus.fail, 'Invalid auction ID format'));
  }

  const data = await auctionService.getProductById(id);
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
};
const updateProduct = async (req, res) => {
  const id = req.params.id;
  const files = req.files;
  const body = req.body;

  const data = await auctionService.updateProduct(id, {
    ...body,
    files,
  });
  if (!data) {
    return res
      .status(400)
      .json(response(responseStatus.fail, transValidation.bad_request));
  }
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, data),
    );
};

const auctionBid = async (req, res) => {
  try {
    const id = req.params.id;
    const amount = req.body.amount;

    logger.info('Bid request received', { 
      auctionId: id, 
      userId: req.idUser, 
      amount,
      timestamp: new Date().toISOString()
    });

    // Validate input
    if (!id || !amount || amount <= 0) {
      logger.warn('Invalid bid parameters', { auctionId: id, amount, userId: req.idUser });
      return res
        .status(400)
        .json(response(responseStatus.fail, 'Invalid bid parameters'));
    }

    const status = await auctionService.auctionBid(id, req.idUser, amount);
    
    if (!status) {
      logger.warn('Bid service returned null', { auctionId: id, userId: req.idUser, amount });
      return res
        .status(400)
        .json(response(responseStatus.fail, 'Không thể đặt giá. Vui lòng kiểm tra lại thông tin.'));
    }

    if (status.error) {
      logger.warn('Bid service returned error', { auctionId: id, userId: req.idUser, amount, error: status.error });
      return res
        .status(400)
        .json(response(responseStatus.fail, status.error));
    }

    logger.info('Bid placed successfully', { 
      auctionId: id, 
      userId: req.idUser, 
      amount,
      result: status 
    });

    startCronJob();
    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, status),
      );
  } catch (error) {
    logger.error('Error in auctionBid controller', error, { 
      auctionId: req.params.id, 
      userId: req.idUser, 
      amount: req.body.amount 
    });
    return res
      .status(500)
      .json(response(responseStatus.fail, transValidation.server_error));
  }
};

const buyNow = async (req, res) => {
  const id = req.params.id;
  const status = await auctionService.buyNow(id, req.idUser, res);
  if (!status) {
    return res
      .status(400)
      .json(response(responseStatus.fail, transValidation.bad_request));
  }
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, status),
    );
};

const autoBid = async (req, res) => {
  const id = req.params.id;
  const { limitBid } = req.body;
  const status = await auctionService.autoBid(id, req.idUser, limitBid, res);
  if (!status) {
    return res
      .status(400)
      .json(response(responseStatus.fail, transValidation.bad_request));
  }
  startCronJob();
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, status),
    );
};

const deleteMyAuction = async (req, res) => {
  const id = req.params.id;
  const status = await auctionService.deleteMyAuction(id, req.idUser);
  if (!status) {
    return res
      .status(400)
      .json(
        response(
          responseStatus.fail,
          transValidation.bad_request,
          errorCode.bad_request,
        ),
      );
  }
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, status),
    );
};

const viewCart = async (req, res) => {
  try {
    const status = await auctionService.viewCart(req.idUser);
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
    logger.error('Error in viewCart controller', error, { userId: req.idUser });
    return res
      .status(500)
      .json(response(responseStatus.fail, transValidation.server_error));
  }
};

const activeAutoBid = async (req, res) => {
  try {
    const status = await auctionService.activeAutoBid();

    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, status),
      );
  } catch (error) {
    logger.error('Error in activeAutoBid controller', error);
    return res
      .status(500)
      .json(response(responseStatus.fail, transValidation.server_error));
  }
};

const listingAuction = async (req, res) => {
  try {
    logger.info('Creating new auction listing', {
      userId: req.idUser,
      productName: req.body.name,
      fileCount: req.files ? req.files.length : 0,
    });

    const files = req.files;
    if (!files || files.length === 0) {
      logger.warn('No files uploaded for auction listing', { userId: req.idUser });
      return res
        .status(400)
        .json(
          response(
            responseStatus.fail,
            'No image files uploaded',
            errorCode.bad_request,
          ),
        );
    }

    const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();
    const durationDays = parseInt(req.body.durationDays) || 1;
    const finishedTime = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const product = {
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      priceBuyNow: req.body.priceBuyNow,
      category: req.body.category,
      durationDays: req.body.durationDays,
      description: req.body.description,
      image: files,
      startDate: startDate,
      finishedTime: finishedTime,
    };

    logger.debug('Product object created for auction', { productName: product.name, userId: req.idUser });

    const createdAuction = await auctionService.listingAuction(product, req.idUser);
    if (!createdAuction) {
      logger.error('Auction creation failed in service', null, { userId: req.idUser, productName: product.name });
      return res.status(400).json(response(responseStatus.fail, 'Failed to create auction'));
    }

    logger.info('Auction created successfully', { auctionId: createdAuction._id, userId: req.idUser, productName: product.name });
    return res
      .status(201)
      .json(
        response(responseStatus.success, transValidation.input_correct, createdAuction),
      );
  } catch (error) {
    logger.error('Error in listingAuction controller', error, { userId: req.idUser, productName: req.body.name });
    return res.status(500).json(
      response(responseStatus.fail, `Server error: ${error.message}`),
    );
  }
};

const eventBidEnd = async (req, res) => {
  const bid_id = req.params.id;

  await auctionService.eventBidEnd(bid_id);

  return res
    .status(200)
    .json(response(responseStatus.success, transValidation.input_correct));
};

const getUploadURL = async (req, res) => {
  const files = req.body;
  if (!files || files.length === 0) {
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

  const arrayImage = Array.isArray(files.key) ? files.key : [files.key];
  const uploadURL = await auctionService.getLinkImage(arrayImage);
  return res
    .status(200)
    .json(
      response(responseStatus.success, transValidation.input_correct, uploadURL),
    );
};

// order
const createOrder = async (req, res) => {
  const { bid_id, price } = req.body;
  try {
    // Only allow the winner to create the order
    const auction = await Auction.findById(bid_id).populate('top_ownerships.user_id');
    if (!auction) return res.status(404).json({ success: false, message: 'Auction not found' });

    // Find the highest bid
    const topBid = auction.top_ownerships.sort((a, b) => b.amount - a.amount)[0];
    const winnerId = typeof topBid.user_id === 'object' && topBid.user_id !== null && topBid.user_id._id
      ? topBid.user_id._id.toString()
      : topBid.user_id.toString();

    if (!topBid || winnerId !== req.idUser.toString()) {
      return res.status(403).json({ success: false, message: 'Only the winner can create the order' });
    }

    // Create the order
    const order = await Order.create({
      user_id: req.idUser,
      bid_id,
      price: price || topBid.amount,
      isPayment: true,
    });

    // Optionally, send confirmation email here

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getOrder = async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.LIMIT_NUMBER;

  try {
    const orders = await Order.find({ user_id: req.idUser })
      .populate('bid_id')
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);
    const { totalOrder, totalPages } = await auctionService.getTotalOrder(
      req.idUser,
      limitNumber,
    );
    const result = {
      orders,
      totalOrder,
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

const getMyAuction = async (req, res) => {
  const { page, limit } = req.query;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.LIMIT_NUMBER;

  try {
    const auction = await Auction.find({ owner: req.idUser })
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);
    const { totalAuction, totalPages } = await auctionService.getTotalAuction(
      req.idUser,
      limitNumber,
    );
    const result = {
      auction,
      totalAuction,
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

const eventCheckout = async (req, res) => {
  try {
    const orders = await auctionService.eventCheckout(req.idUser);
    if (!orders) {
      return res.status(400).json(response(responseStatus.fail, transValidation.bad_request));
    }
    return res.status(200).json(response(responseStatus.success, transValidation.input_correct, orders));
  } catch (error) {
    return res.status(500).json(response(responseStatus.fail, transValidation.bad_request));
  }
};

const checkUserOrder = async (req, res) => {
  const { bid_id } = req.params;
  try {
    const order = await Order.findOne({
      user_id: req.idUser,
      bid_id: bid_id,
    });
    return res.status(200).json({
      hasOrder: !!order,
      order: order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  buyNow,
  autoBid,
  activeAutoBid,
  getAuctionEnd,
  getProductByCategory,
  getProductById,
  auctionBid,
  listingAuction,
  eventBidEnd,
  getProductBySearch,
  getAllCategory,
  getUploadURL,
  getAuctionByStatus,
  viewCart,
  createOrder,
  getOrder,
  checkUserOrder,
  getMyAuction,
  deleteMyAuction,
  updateProduct,
  getUserAuctionByStatus,
  getAuctionUserBought,
  getAuctionUserSold,
  eventCheckout,
};
