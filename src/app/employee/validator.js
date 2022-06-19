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
		institution: Joi.objectId().required(),
		firstName: Joi.string().min(3).trim().required(),
		lastName: Joi.string().min(3).trim().required(),
		email: Joi.string().email().required(),
		specialty: Joi.string().required(),
		password: Joi.string().required(),
		photo: Joi.string().base64(),
	},
});

const update = Joi.object({
	body: {
		institution: Joi.objectId(),
		firstName: Joi.string().min(3).trim(),
		lastName: Joi.string().min(3).trim(),
		specialty: Joi.string(),
		password: Joi.string(),
		photo: Joi.string().base64(),
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

const login = Joi.object({
	body: {
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	},
});

const getByCriteria = Joi.object({
	query: {
		fn: Joi.string(),
		ln: Joi.string(),
		specialty: Joi.string(),
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
	login: validate(login),
	getByCriteria: validate(getByCriteria),
};
