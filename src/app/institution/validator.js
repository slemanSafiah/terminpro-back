const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { validate } = require('../../../utils/validator');
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const paramId = Joi.object({
	params: {
		id: Joi.objectId().required(),
	},
});

const save = Joi.object({
	body: {
		owner: Joi.objectId().required(),
		email: Joi.string().email().required(),
		name: Joi.string().min(3).max(20).trim().required(),
		subtitle: Joi.string().required(),
		description: Joi.string().required(),
		category: Joi.string().required(),
		subCategory: Joi.array().items(Joi.string()).unique(),
		phone: Joi.string().required(),
		photo: Joi.string().base64(),
		address: {
			country: Joi.string(),
			city: Joi.string(),
			location: Joi.string(),
			longitude: Joi.number(),
			latitude: Joi.number(),
		},
		slider: Joi.array(),
		paypalEmail: Joi.string(),
		openingDays: Joi.array()
			.items(Joi.string().valid(...days))
			.required(),
		openAt: Joi.number().max(24).min(0).required(),
		closeAt: Joi.number().max(24).min(0).required(),
	},
});

const update = Joi.object({
	body: {
		name: Joi.string().min(3).max(20).trim(),
		description: Joi.string(),
		subtitle: Joi.string(),
		category: Joi.string(),
		subtitle: Joi.string(),
		subCategory: Joi.array().items(Joi.string()).unique(),
		phone: Joi.string(),
		photo: Joi.string().base64(),
		address: {
			country: Joi.string(),
			city: Joi.string(),
			location: Joi.string(),
			longitude: Joi.number(),
			latitude: Joi.number(),
		},
		paypalEmail: Joi.string(),
		openingDays: Joi.array().items(Joi.string().valid(...days)),
		openAt: Joi.number().max(24).min(0),
		closeAt: Joi.number().max(24).min(0),
		subscription: {
			plan: Joi.objectId(),
			start: Joi.date(),
		},
	},
	params: {
		id: Joi.objectId(),
	},
});

const rate = Joi.object({
	body: {
		rate: Joi.number().max(5).min(1).required(),
		id: Joi.objectId().required(),
	},
	params: {
		id: Joi.objectId().required(),
	},
});

const getByCriteria = Joi.object({
	query: {
		name: Joi.string(),
		cat: Joi.string(),
		subCat: Joi.string(),
		sort: Joi.number().default(1),
		skip: Joi.number().integer().min(0).default(0),
		limit: Joi.number().integer().min(1).max(50).default(10),
		total: Joi.boolean().default(false),
	},
});

module.exports = {
	paramId: validate(paramId),
	save: validate(save),
	update: validate(update),
	rate: validate(rate),
	getByCriteria: validate(getByCriteria),
};
