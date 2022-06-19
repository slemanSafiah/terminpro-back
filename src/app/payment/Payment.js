const { boolean } = require('joi');
const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
	{
		_id: { type: Schema.Types.ObjectId, auto: true },
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		institution: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		start: { type: Date, required: true },
		end: { type: Date, required: true },
		price: { type: String },
		paymentId: { type: String },
		done: { type: Schema.Types.Boolean, default: false },
		plan: { type: Schema.Types.String },
	},
	{
		timestamps: true,
		useNestedStrict: true,
		optimisticConcurrency: true,
	}
);

const Payment = mongoose.model('Payment', PaymentSchema, 'Payments');

module.exports = Payment;
