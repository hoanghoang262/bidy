const expess = require("express");
const router = expess.Router();

const chatController = require("./chat.controller");
const authenMiddleware = require("../Middlewares/authen.middleware");

// conversation
router.get("/admin/get-all", authenMiddleware.isAuth, chatController.getAllConversation);
router.get("/conversation/me", authenMiddleware.isAuth, chatController.getMyConversation);
router.get("/conversation/:id", authenMiddleware.isAuth, chatController.getConversationById);
router.post("/conversation", authenMiddleware.isAuth, chatController.createConversation);
// message
router.post("/message", authenMiddleware.isAuth, chatController.createMessage);

router.get("/get-message-by-user", authenMiddleware.isAuth, chatController.getAllMessageByUserId);
router.get(
	"/get-message-conversation/:id",
	authenMiddleware.isAuth,
	chatController.getAllMessageByConversationId
);
module.exports = router;
