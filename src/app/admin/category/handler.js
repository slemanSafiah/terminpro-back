const _ = require('lodash');
const Category = require('./service');
const { httpStatus } = require('../../../../utils');

module.exports = {
	/** Add a new Category */
	save: async (req, res) => {
		const data = req.body;
		const result = await new Category(data).save();
		res.status(httpStatus.CREATED).json(result);
	},

	/** Update a Category */
	update: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await new Category(data).update(id);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Delete a Category */
	delete: async (req, res) => {
		const { id } = req.params;
		const result = await Category.delete(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get Category by id */
	getById: async (req, res) => {
		const { id } = req.params;
		const result = await Category.getById(id);
		res.status(httpStatus.OK).json(result);
	},

	/** get all Categories */
	getAllCategories: async (req, res) => {
		const result = await Category.getAllCategories();
		res.status(httpStatus.OK).json(result);
	},
};
