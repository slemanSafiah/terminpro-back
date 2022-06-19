const Schema = require('mongoose').Schema;

const Photo = new Schema(
	{
		filename: String,
		path: String,
		size: Number,
		width: Number,
		height: Number,
	},
	{ _id: false }
);

module.exports = Photo;
