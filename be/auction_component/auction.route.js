const express = require("express");
const router = express.Router();
const auctionController = require("./auction.controller");
const authenMiddleware = require("../Middlewares/authen.middleware");
const uploadMiddleware = require("../Middlewares/image_upload.middleware");
router.get("/listing/:id", auctionController.getProductById);
router.get("/category/:category", auctionController.getProductByCategory);

router.post("/images", auctionController.getUploadURL);
router.post(
  "/listing",
  uploadMiddleware.array("images"),
  authenMiddleware.isAuth,
  auctionController.listingAuction
);
router.get("/order", authenMiddleware.isAuth, auctionController.getOrder);

router.get("/categories", auctionController.getAllCategory);
router.get(
  "/myAuction",
  authenMiddleware.isAuth,
  auctionController.getMyAuction
);
router.get("/cart", authenMiddleware.isAuth, auctionController.viewCart);
router.get("/test", auctionController.activeAutoBid);
router.get("/end", auctionController.getAuctionEnd);
router.get("/:status", auctionController.getAuctionByStatus);
router.get("/bought/:id", auctionController.getAuctionUserBought);
router.get("/sold/:id", auctionController.getAuctionUserSold);
router.get("/:id/:status", auctionController.getUserAuctionByStatus);
router.get("/listing/search/:keyword", auctionController.getProductBySearch);
router.post(
  "/listing/:id/buy-now",
  authenMiddleware.isAuth,
  auctionController.buyNow
);
router.post(
  "/listing/:id/bid",
  authenMiddleware.isAuth,
  auctionController.auctionBid
);
router.post(
  "/listing/:id/auto-bid",
  authenMiddleware.isAuth,
  auctionController.autoBid
);
router.delete(
  "/myAuction/:id/delete",
  authenMiddleware.isAuth,
  auctionController.deleteMyAuction
);
router.put(
  "/listing/:id/",
  uploadMiddleware.array("image"),
  auctionController.updateProduct
);

router.post("/:id/end", auctionController.eventBidEnd);

// order
router.post(
  "/order/create",
  authenMiddleware.isAuth,
  auctionController.createOrder
);

// Check if user has paid for specific auction
router.get(
  "/order/:bid_id/check",
  authenMiddleware.isAuth,
  auctionController.checkUserOrder
);

// Payment/checkout route
router.post(
  "/payment",
  authenMiddleware.isAuth,
  auctionController.eventCheckout
);

module.exports = router;
