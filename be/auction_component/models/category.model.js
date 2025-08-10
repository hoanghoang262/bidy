const { model, models, Schema } = require('mongoose');

const categorySchema = new Schema(
	{
		name: {
			required: true,
			type: String,
		},
		image: [
			{
				type: String,
			},
		],
		status: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

const Category = models.Category || model('Category', categorySchema);
module.exports = Category;
