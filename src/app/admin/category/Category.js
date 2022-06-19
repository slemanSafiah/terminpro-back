const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
	{
		_id: { type: Schema.ObjectId, auto: true },
		name: { type: String, require: true },
	},
	{
		timestamps: true,
		useNestedStrict: true,
		optimisticConcurrency: true,
	}
);

const Category = mongoose.model('Category', CategorySchema, 'Categorys');

module.exports = Category;
