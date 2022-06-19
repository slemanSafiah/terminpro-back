const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { validate } = require('../../../utils/validator');

const paramId = Joi.object({
	params: {
		id: Joi.objectId().required(),
	},
});

const save = Joi.object({
	body: {
		type: Joi.string().valid('user', 'owner').required(),
		email: Joi.string().email().required(),
		firstName: Joi.string().min(3).max(20).trim().required(),
		lastName: Joi.string().min(3).max(20).trim().required(),
		password: Joi.string().required(),
	},
});

const update = Joi.object({
	body: {
		firstName: Joi.string(),
		lastName: Joi.string(),
		password: Joi.string(),
		photo: Joi.string().base64(),
		address: {
			country: Joi.string(),
			city: Joi.string(),
			location: Joi.string(),
			building: Joi.number(),
		},
		phone_1: Joi.string().required(),
		phone_2: Joi.string(),
		urls: {
			facebook: Joi.string(),
			instagram: Joi.string(),
			tiktok: Joi.string(),
			website: Joi.string(),
		},
	},
	params: {
		id: Joi.objectId().required(),
	},
});

const getByCriteria = Joi.object({
	query: {
		ln: Joi.string(),
		fn: Joi.string(),
		sort: Joi.number().default(1),
		skip: Joi.number().integer().min(0).default(0),
		limit: Joi.number().integer().min(1).max(50).default(10),
		total: Joi.boolean().default(false),
	},
});

const login = Joi.object({
	body: {
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	},
});

module.exports = {
	paramId: validate(paramId),
	save: validate(save),
	update: validate(update),
	login: validate(login),
	getByCriteria: validate(getByCriteria),
};
