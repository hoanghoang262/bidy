const { model, models, Schema } = require('mongoose');

const cartSchema = new Schema(
	{
		user_id: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		bid_id: {
			type: Schema.Types.ObjectId,
			ref: 'Bid',
			required: true,
		},
		price: {
			type: String,
		},
		status: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

const Cart = models.Cart || model('Cart', cartSchema);
module.exports = Cart;
