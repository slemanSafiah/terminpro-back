const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Address = new Schema(
	{
		country: { type: String },
		city: { type: String },
		location: { type: String },
		building: {type : Number}
	},
	{ _id: false }
);

module.exports = Address;
