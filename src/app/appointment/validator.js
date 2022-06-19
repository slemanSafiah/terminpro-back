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
		date: Joi.string().required(),
		history: Joi.number().required(),
		service: Joi.array().required(),
		institution: Joi.objectId().required(),
		user: Joi.objectId().required(),
		employee: Joi.objectId().required(),
	},
});

const getByCriteria = Joi.object({
	query: {
		employee: Joi.objectId(),
		institution: Joi.objectId(),
		user: Joi.objectId(),
		service: Joi.objectId(),
		history: Joi.number(),
		sort: Joi.number().default(1),
		skip: Joi.number().integer().min(0).default(0),
		limit: Joi.number().integer().min(1).max(50).default(10),
		total: Joi.boolean().default(false),
	},
});

module.exports = {
	paramId: validate(paramId),
	save: validate(save),
	getByCriteria: validate(getByCriteria),
};
