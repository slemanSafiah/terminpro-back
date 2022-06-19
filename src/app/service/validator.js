const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { validate } = require('../../../utils/validator');
const categories = ['category1', 'category2'];
const days = ['saturday , sunday , monday ,tuesday', 'wednesday', 'thursday', 'friday'];

const paramId = Joi.object({
	params: {
		id: Joi.objectId().required(),
	},
});

const save = Joi.object({
	body: {
		institution: Joi.objectId().required(),
		name: Joi.string().min(3).trim().required(),
		description: Joi.string().required(),
		category: Joi.string().required(),
		length: Joi.number().required(),
		price: Joi.number().required(),
		atLeast: Joi.bool(),
		retainer: Joi.number(),
		hasRetainer: Joi.bool(),
	},
});

const update = Joi.object({
	body: {
		name: Joi.string().min(3).trim(),
		description: Joi.string(),
		category: Joi.string(),
		length: Joi.number(),
		price: Joi.number(),
		atLeast: Joi.bool(),
		retainer: Joi.number(),
		hasRetainer: Joi.bool(),
	},
	params: {
		id: Joi.objectId(),
	},
});

const getByCriteria = Joi.object({
	query: {
		name: Joi.string(),
		cat: Joi.string(),
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
	getByCriteria: validate(getByCriteria),
};
