const { model, models, Schema } = require("mongoose");

const orderSchema = new Schema(
	{
		user_id: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		bid_id: {
			type: Schema.Types.ObjectId,
			ref: "Bid",
			required: true,
		},
		price: {
			type: String,
		},
		isPayment: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Order = models.Order || model("Order", orderSchema);
module.exports = Order;
