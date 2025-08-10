const { model, models, Schema } = require('mongoose');

const wishlistSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    auction_id: { type: Schema.Types.ObjectId, ref: 'Bid', required: true },
    status: { type: String },
  },
  {
    timestamps: true,
  },
);

const Wishlist = models.Wishlist || model('Wishlist', wishlistSchema);
module.exports = Wishlist;
