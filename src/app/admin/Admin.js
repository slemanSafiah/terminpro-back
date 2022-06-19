const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
	{
		_id: { type: Schema.ObjectId, auto: true },
		email: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		password: {
			type: String,
			required: true,
			set: (val) => (val ? bcrypt.hashSync(val, 10) : undefined),
		},
	},
	{
		timestamps: true,
		useNestedStrict: true,
		optimisticConcurrency: true,
	}
);

const Admin = mongoose.model('Admin', AdminSchema, 'Admins');

module.exports = Admin;
