const User = require("../user_components/models/user.model");
const Auction = require("../auction_component/models/bid.model");
const Category = require("../auction_component/models/category.model");
const auctionService = require("../auction_component/auction.service");
const userService = require("../user_components/user.service");
const { response } = require("../util/response");
const { formatWord } = require("../util/format");
const { transValidation, responseStatus, errorCode } = require("../langs/vn");
const aws = require("aws-sdk");
const s3 = new aws.S3();

// ---> common
const getTotal = async (field, query, limitNumber) => {
  const total = await field.find({ ...query }).countDocuments();
  const totalPages = Math.ceil(total / limitNumber);
  return { total, totalPages };
};

// ---> user
const getAllUser = async (req, res) => {
  const { page, limit, keyword, status } = req.query;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.ADMIN_LIMIT_NUMBER;

  try {
    const query = {};
    if (keyword) {
      query.$or = [
        { full_name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }
    if (status !== undefined) {
      query.status = status;
    }

    const users = await User.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const { total: totalUsers, totalPages } = await getTotal(
      User,
      query,
      limitNumber
    );

    const result = {
      users,
      totalUsers,
      totalPages,
      currentPage: totalPages ? pageNumber : 0,
    };
    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, result)
      );
  } catch (err) {
    return res
      .status(500)
      .json(response(responseStatus.error, errorCode.server_error));
  }
};

const updateStatusUser = async (req, res) => {
  const { id } = req.params;

  try {
    const isExist = await User.findById(id);
    if (!isExist) {
      return res
        .status(404)
        .json(response(responseStatus.error, transValidation.user_not_exist));
    }

    const update = await User.findOneAndUpdate(
      { _id: id },
      { status: !isExist.status },
      { new: true }
    );

    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, update)
      );
  } catch (error) {
    return res
      .status(500)
      .json(response(responseStatus.error, transValidation.server_error));
  }
};

// ---> auction
const getAllAuction = async (req, res) => {
  const { page, limit, keyword } = req.query;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.ADMIN_LIMIT_NUMBER;

  try {
    const query = {
      ...(keyword && {
        name: { $regex: keyword, $options: "i" },
      }),
    };

    const auctions = await Auction.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate("category", "name");

    const { total: totalAuctions, totalPages } = await getTotal(
      Auction,
      query,
      limitNumber
    );

    const result = {
      auctions,
      totalAuctions,
      totalPages,
      currentPage: totalPages ? pageNumber : 0,
    };

    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, result)
      );
  } catch (err) {
    return res
      .status(500)
      .json(response(responseStatus.error, errorCode.server_error));
  }
};

// ---> category
const getAllCate = async (req, res) => {
  const { page, limit, keyword, status } = req.query;
  const pageNumber = +page || +process.env.PAGE_NUMBER;
  const limitNumber = +limit || +process.env.ADMIN_LIMIT_NUMBER;
  const query = {
    ...(keyword && {
      name: { $regex: keyword, $options: "i" },
    }),
    ...(status && { status }),
  };
  try {
    const categories = await Category.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const { total: totalCategories, totalPages } = await getTotal(
      Category,
      query,
      limitNumber
    );

    const result = {
      categories,
      totalCategories,
      totalPages,
      currentPage: totalPages ? pageNumber : 0,
    };

    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, result)
      );
  } catch (err) {
    return res
      .status(500)
      .json(response(responseStatus.error, errorCode.server_error));
  }
};

const getUploadURL = async (cate) => {
  const keyImages = [];
  const uploadPromises = cate.image.map(async (file) => {
    const key = `${file.originalname}_${Date.now()}_${Math.random()}`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const result = await s3.upload(params).promise();
    keyImages.push(key);
    return result.Location;
  });
  await Promise.all(uploadPromises);
  return keyImages;
};

const createCate = async (req, res) => {
  const { name } = req.body;
  const files = req.files;

  const sanitizedName = formatWord(name);

  try {
    if (!files || files.length === 0) {
      return res
        .status(500)
        .json(
          response(
            responseStatus.fail,
            transValidation.bad_request,
            errorCode.bad_request
          )
        );
    }

    const isExist = await Category.findOne({
      name: { $regex: sanitizedName, $options: "i" },
    });

    if (isExist) {
      return res
        .status(400)
        .json(response(responseStatus.error, transValidation.category_exist));
    }

    const cate = {
      name: sanitizedName,
      image: files,
    };

    const keyImages = await getUploadURL(cate);
    const newCate = await Category.create({
      name: sanitizedName,
      image: keyImages,
    });

    return res
      .status(201)
      .json(
        response(responseStatus.success, transValidation.input_correct, newCate)
      );
  } catch (error) {
    return res.status(500).json(response(responseStatus.error, error.message));
  }
};

const updateCate = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const files = req.files;
  const sanitizedName = formatWord(name);

  try {
    const existingWithSameName = await Category.findOne({
      name: sanitizedName,
      _id: { $ne: id },
    });

    if (existingWithSameName) {
      return res
        .status(400)
        .json(response(responseStatus.error, transValidation.category_exist));
    }

    const cate = {
      name: sanitizedName,
      image: files,
    };

    const url = await getUploadURL(cate);
    const updateCate = await Category.findOneAndUpdate(
      { _id: id },
      { name: sanitizedName, image: url },
      { new: true }
    );

    res
      .status(200)
      .json(
        response(
          responseStatus.success,
          transValidation.input_correct,
          updateCate
        )
      );
  } catch (error) {
    return res.status(500).json(response(responseStatus.error, error.message));
  }
};

const deleteCate = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.deleteOne({
      _id: id,
    });

    if (!category) {
      return res
        .status(404)
        .json(
          response(responseStatus.error, transValidation.category_not_exist)
        );
    }

    return res
      .status(200)
      .json(response(responseStatus.success, transValidation.input_correct));
  } catch (error) {
    return res.status(500).json(response(responseStatus.error, error.message));
  }
};

// ---> statistic
const getStatisticUser = async (req, res) => {
  const totalUsers = await User.find();
  const isBlock = totalUsers.filter((i) => i.status === false).length;

  return {
    totalUsers: totalUsers.length,
    isBlock,
    isActive: totalUsers.length - isBlock,
  };
};

const getStatisticAuction = async (req, res) => {
  const totalAuctions = await Auction.find();
  const isFinished = totalAuctions.filter((i) => i.status === "end").length;
  const isHappening = totalAuctions.filter(
    (i) => i.status === "happenning"
  ).length;

  return {
    totalAuctions: totalAuctions.length,
    isFinished,
    isHappening,
  };
};

const getStatisticCate = async (req, res) => {
  const totalCategories = await Category.find();
  const isHide = totalCategories.filter((i) => i.status === false).length;

  return {
    totalCategories: totalCategories.length,
    isHide,
    isShow: totalCategories.length - isHide,
  };
};

const getStatistic = async (req, res) => {
  try {
    const { totalUsers, isBlock, isActive } = await getStatisticUser();
    const { totalAuctions, isFinished, isHappening } =
      await getStatisticAuction();
    const { totalCategories, isHide, isShow } = await getStatisticCate();

    const result = {
      users: {
        totalUsers,
        isBlock,
        isActive,
      },
      auctions: {
        totalAuctions,
        isFinished,
        isHappening,
      },
      categories: {
        totalCategories,
        isHide,
        isShow,
      },
    };

    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, result)
      );
  } catch (error) {
    return res.status(500).json(response(responseStatus.error, error.message));
  }
};

const getStatsAuctions = async (req, res) => {
  try {
    const { year } = req.query;

    const stats = await auctionService.getMonthlyAuctionStats(year);
    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, stats)
      );
  } catch (error) {
    return res.status(500).json(response(responseStatus.error, error.message));
  }
};

const getStatsUsers = async (req, res) => {
  try {
    const { year } = req.query;
    const stats = await userService.getMonthlyUserStats(year);
    return res
      .status(200)
      .json(
        response(responseStatus.success, transValidation.input_correct, stats)
      );
  } catch (error) {
    return res.status(500).json(response(responseStatus.error, error.message));
  }
};

module.exports = {
  getAllUser,
  updateStatusUser,
  getAllAuction,
  createCate,
  updateCate,
  getAllCate,
  deleteCate,
  getStatistic,
  getStatsAuctions,
  getStatsUsers,
};
