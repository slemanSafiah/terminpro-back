const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const Rating = require('../../../utils/schemaHelper/Rate');

const EmployeeSchema = new Schema(
	{
		_id: { type: Schema.ObjectId, auto: true },
		institution: { type: Schema.Types.ObjectId, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		specialty: { type: String, required: true },
		password: {
			type: String,
			required: true,
			trim: true,
			set: (val) => (val ? bcrypt.hashSync(val, 10) : undefined),
		},
		photo: {
			type: String,
		},
		rating: {
			type: [Rating],
		},
	},
	{
		timestamps: true,
		useNestedStrict: true,
		optimisticConcurrency: true,
	}
);

EmployeeSchema.virtual('rate').get(function () {
	if (!this.rating) return 0;
	const sum = this.rating.reduce((acc, cur) => {
		return acc + cur.rate;
	}, 0);
	return sum / this.rating.length;
});

const Employee = mongoose.model('Employee', EmployeeSchema, 'Employees');

module.exports = Employee;
