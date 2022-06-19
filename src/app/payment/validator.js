const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { validate } = require('../../../utils/validator');

const paramId = Joi.object({
	params: {
		id: Joi.objectId().required(),
	},
});

const checkout = Joi.object({
	body: {
		id: Joi.objectId().required(),
		institution: Joi.objectId().required(),
	},
});

const adaptivePayment = Joi.object({
	body: {
		services: Joi.array().required(),
		institution: Joi.objectId().required(),
		date: Joi.string(),
		time: Joi.string(),
		price: Joi.number(),
		length: Joi.number(),
	},
	params: {
		id: Joi.objectId(),
	},
});

module.exports = {
	paramId: validate(paramId),
	checkout: validate(checkout),
	adaptivePayment: validate(adaptivePayment),
};
