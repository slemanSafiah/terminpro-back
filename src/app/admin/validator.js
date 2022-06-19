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
		firstName: Joi.string().min(3).trim().required(),
		lastName: Joi.string().min(3).trim().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	},
});

const update = Joi.object({
	body: {
		firstName: Joi.string().min(3).trim(),
		lastName: Joi.string().min(3).trim(),
		password: Joi.string(),
	},
	params: {
		id: Joi.objectId(),
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
};
