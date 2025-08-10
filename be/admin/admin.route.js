const expess = require("express");
const router = expess.Router();
const authenMiddleware = require("../Middlewares/authen.middleware");
const adminController = require("./admin.controller");
const uploadMiddleware = require("../Middlewares/image_upload.middleware");

// ---> user
router.get(
  "/get-all-user",
  authenMiddleware.isAdmin,
  adminController.getAllUser
);
router.put(
  "/update-status-user/:id",
  authenMiddleware.isAdmin,
  adminController.updateStatusUser
);

// ---> auction
router.get(
  "/get-all-auction",
  authenMiddleware.isAdmin,
  adminController.getAllAuction
);

// ---> category
router.get(
  "/get-all-category",
  authenMiddleware.isAdmin,
  adminController.getAllCate
);
router.post(
  "/create-category",
  uploadMiddleware.array("images"),
  authenMiddleware.isAdmin,
  adminController.createCate
);
router.patch(
  "/update-category/:id",
  uploadMiddleware.array("images"),
  authenMiddleware.isAdmin,
  adminController.updateCate
);
router.delete(
  "/delete-category/:id",
  authenMiddleware.isAdmin,
  adminController.deleteCate
);

// ---> statistic
router.get(
  "/get-statistic",
  authenMiddleware.isAdmin,
  adminController.getStatistic
);
router.get(
  "/statistic/auctions",
  authenMiddleware.isAdmin,
  adminController.getStatsAuctions
);
router.get(
  "/statistic/users",
  authenMiddleware.isAdmin,
  adminController.getStatsUsers
);

module.exports = router;
