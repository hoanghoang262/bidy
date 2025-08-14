const { model, models, Schema } = require('mongoose');

const bidSchema = new Schema(
	{
		name: {
			type: String,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		durationDays: {
			type: String,
		},
		quantity: {
			type: Number,
		},
		image: [
			{
				type: String,
			},
		],
		description: {
			type: String,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		startDate: {
			type: Date,
			default: Date.now,
		},
		finishedTime: {
			type: Date,
		},
		bidHideTime: {
			type: Date,
		},
		price: {
			type: String,
		},
		priceBuyNow: {
			type: String,
		},
		hasActiveAutoBid: {
			type: Boolean,
		},
		top_ownerships: [
			{
				user_id: {
					type: Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				user_name: {
					type: String,
				},
				amount: {
					type: Number,
				},
				isAuto: {
					type: Boolean,
				},
				limitBid: {
					type: Number,
				},
			},
		],
		status: { type: String },
	},
	{ timestamps: true },
);

// Performance optimization: Add database indexes for frequently queried fields
bidSchema.index({ owner: 1 }); // For getUserAuctionByStatus, getMyAuction
bidSchema.index({ category: 1 }); // For getProductByCategory
bidSchema.index({ status: 1 }); // For getAuctionByStatus
bidSchema.index({ startDate: 1 }); // For cron job processing and upcoming auctions
bidSchema.index({ finishedTime: 1 }); // For cron job processing and ended auctions
bidSchema.index({ hasActiveAutoBid: 1 }); // For auto-bid processing
bidSchema.index({ name: 'text' }); // For text search on auction names
bidSchema.index({ createdAt: -1 }); // For sorting by creation date
bidSchema.index({ status: 1, finishedTime: 1 }); // Compound index for active auctions
bidSchema.index({ owner: 1, status: 1 }); // Compound index for user's auctions by status

const Bid = models.Bid || model('Bid', bidSchema);
module.exports = Bid;
