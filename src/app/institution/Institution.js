const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Address = require('../../../utils/schemaHelper/Address');
const Rating = require('../../../utils/schemaHelper/Rate');

function arrayLimit(val) {
	return val.length <= 10;
}

const InstitutionSchema = new Schema(
	{
		_id: { type: Schema.ObjectId, auto: true },
		owner: { type: Schema.ObjectId, required: true },
		email: { type: String, required: true },
		name: { type: String, required: true },
		subtitle: { type: String, required: true },
		description: { type: String, required: true },
		phone: { type: String },
		category: { type: String, required: true },
		subCategory: [String],
		address: [Address],
		rating: {
			type: [Rating],
		},
		photo: { type: String },
		slider: {
			type: [String],
			validate: [arrayLimit, 'exceeds the limit of 10 image'],
		},
		paypalEmail: { type: String, default: '' },
		openingDays: [String],
		openAt: { type: Number, required: true },
		closeAt: { type: Number, required: true },
		subscription: {
			plan: { type: Schema.Types.ObjectId, ref: 'Plan', default: null },
			start: { type: Date },
		},
		notified: { type: Boolean, default: false },
		freezed: { type: Boolean, default: false },
		blocked: { type: Boolean, default: false },
		retainer: { type: Number, default: 0 },
		hasRetainer: { type: Boolean, default: false },
	},
	{
		timestamps: true,
		useNestedStrict: true,
		optimisticConcurrency: true,
	}
);

InstitutionSchema.virtual('rate').get(function () {
	if (!this.rating) return 0;
	const sum = this.rating.reduce((acc, cur) => {
		return acc + cur.rate;
	}, 0);
	return sum / this.rating.length;
});

const Institution = mongoose.model('Institution', InstitutionSchema, 'Institutions');

module.exports = Institution;
