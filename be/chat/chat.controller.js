const Conversation = require('./models/conversation.model');
const Message = require('./models/message.model');
const User = require('../user_components/models/user.model');
require('dotenv').config();
const { transValidation, responseStatus, errorCode: _errorCode } = require('../langs/vn');
const { response } = require('../util/response');

const socket = (io) => {
	const users = [];
	io.on('connection', (socket) => {
		socket.on('addUser', (userId) => {
			const user = { userId, socketId: socket.id };
			const isUserExist = users.find((user) => user.userId === userId);
			if (!isUserExist) {
				users.push(user);
				socket.emit('getUsers', users);
			}
		});

		socket.on('sendMessage', ({ senderId, receiverId, conversationId, message }) => {
			// const receiver = users.find((user) => user.userId === receiverId);

			// if (receiver) {
			// 	socket.to(receiver.socketId).emit("getMessage", {
			// 		senderId,
			// 		receiverId,
			// 		conversationId,
			// 		message,
			// 	});
			// 	console.log("-----------Socket send mesage-------------------");
			// }

			socket.broadcast.emit('getMessage', {
				senderId,
				receiverId,
				conversationId,
				message,
			});
		});

		io.on('disconnect', () => {
			const userIndex = users.findIndex((user) => user.socketId === socket.id);
			if (userIndex !== -1) {
				users.splice(userIndex, 1);
				io.emit('getUsers', users);
			}
		});
	});
};

// conversation
const createConversation = async (req, res) => {
	try {
		const isExist = await Conversation.findOne({
			members: { $all: [req.idUser, process.env.ID_ADMIN] },
		});

		if (isExist) {
			return res.status(400).json(response(responseStatus.error, transValidation.conversation_exist));
		}

		const newConversation = new Conversation({ members: [req.idUser, process.env.ID_ADMIN] });
		await newConversation.save();

		return res
			.status(201)
			.json(response(responseStatus.success, transValidation.input_correct, newConversation));
	} catch (error) {
		return res.status(500).json(response(responseStatus.error, error.message));
	}
};

const getAllConversation = async (req, res) => {
	try {
		const conversations = await Conversation.find();

		const filter = conversations.map((conversation) => ({
			conversationId: conversation._id,
			members: conversation.members.filter((member) => member !== req.idUser)[0],
		}));

		const result = await Promise.all(
			filter.map(async (item) => {
				const user = await User.findById(item.members);
				return {
					conversationId: item.conversationId,
					user: {
						id: user?._id,
						fullName: user?.full_name,
						email: user?.email,
					},
				};
			}),
		);

		return res.status(200).json(response(responseStatus.success, transValidation.input_correct, result));
	} catch (error) {
		return res.status(500).json(response(responseStatus.error, error.message));
	}
};

const getConversationById = async (req, res) => {
	const { id } = req.params;
	try {
		const conversation = await Conversation.findById(id);
		const user = await User.findById(conversation.members[0]);

		const result = {
			conversationId: conversation._id,
			user: {
				id: user._id,
				fullName: user.full_name,
				email: user.email,
			},
		};

		if (!conversation) {
			return res
				.status(404)
				.json(response(responseStatus.error, transValidation.conversation_not_found));
		}

		return res.status(200).json(response(responseStatus.success, transValidation.input_correct, result));
	} catch (error) {
		return res.status(500).json(response(responseStatus.error, error.message));
	}
};

const getMyConversation = async (req, res) => {
	try {
		const conversations = await Conversation.find({ members: req.idUser });

		return res
			.status(200)
			.json(response(responseStatus.success, transValidation.input_correct, conversations));
	} catch (error) {
		return res.status(500).json(response(responseStatus.error, error.message));
	}
};

// message
const createMessage = async (req, res) => {
	const { conversationId, message } = req.body;
	try {
		const isYourConversation = await Conversation.findOne({
			_id: conversationId,
			members: req.idUser,
		});

		if (!isYourConversation) {
			return res
				.status(404)
				.json(response(responseStatus.error, transValidation.conversation_not_found));
		}

		const newMessage = new Message({
			senderId: req.idUser,
			conversationId,
			message,
		});
		await newMessage.save();

		return res
			.status(201)
			.json(response(responseStatus.success, transValidation.input_correct, newMessage));
	} catch (error) {
		return res.status(500).json(response(responseStatus.error, error.message));
	}
};

const getAllMessageByConversationId = async (req, res) => {
	const { id } = req.params;
	try {
		const isYourConversation = await Conversation.findOne({
			_id: id,
		});

		if (!isYourConversation) {
			return res
				.status(404)
				.json(response(responseStatus.error, transValidation.conversation_not_found));
		}

		const messages = await Message.find({ conversationId: id });

		return res
			.status(200)
			.json(response(responseStatus.success, transValidation.input_correct, messages));
	} catch (error) {
		return res.status(500).json(response(responseStatus.error, error.message));
	}
};

const getAllMessageByUserId = async (req, res) => {
	try {
		const isExist = await Conversation.findOne({
			members: { $all: [req.idUser, process.env.ID_ADMIN] },
		});

		if (!isExist) {
			return res
				.status(404)
				.json(response(responseStatus.error, transValidation.conversation_not_found));
		}

		const messages = await Message.find({ conversationId: isExist._id });

		return res
			.status(200)
			.json(response(responseStatus.success, transValidation.input_correct, messages));
	} catch (error) {
		return res.status(500).json(response(responseStatus.error, error.message));
	}
};

module.exports = {
	// conversation
	createConversation,
	getAllConversation,
	getConversationById,
	getMyConversation,
	// message
	createMessage,
	getAllMessageByConversationId,
	getAllMessageByUserId,
	socket,
};
