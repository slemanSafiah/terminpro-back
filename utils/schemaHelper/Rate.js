const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Rating = new Schema(
	{
		user: Schema.Types.ObjectId,
		rate: Number,
		ratedAt: { type: Date, default: Date.now() },
	},
	{ _id: false }
);

module.exports = Rating;