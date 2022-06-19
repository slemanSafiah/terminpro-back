const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const userType = ['institution', 'customer'];

const UserSchema = new Schema(
	{
		_id: { type: Schema.ObjectId, auto: true },
		type: { type: String, enum: userType, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		mobile: { type: String, required: true },
		password: {
			type: String,
			required: true,
			trim: true,
			set: (val) => (val ? bcrypt.hashSync(val, 10) : undefined),
		},
		paypal: { type: String, required: true },
		img: { type: String },
		institutionName: { type: String },
		category: { type: String },
		description: { type: String },
		location: { type: String },
		gallery: { type: [String] },
	},
	{
		timestamps: true,
		useNestedStrict: true,
		optimisticConcurrency: true,
	}
);

const User = mongoose.model('User', UserSchema, 'Users');

module.exports = User;
