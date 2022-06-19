const _ = require('lodash');
const Admin = require('./service');
const { httpStatus } = require('../../../utils');

module.exports = {
	/** Add a new Admin */
	save: async (req, res) => {
		const data = req.body;
		const result = await new Admin(data).save();
		res.status(httpStatus.CREATED).json(result);
	},

	/** Update a Admin */
	update: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await new Admin(data).update(id);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Subscribe for free */
	freeSubscribe: async (req, res) => {
		const criteria = _.pick(req.query, ['plan', 'inst']);
		const result = await Admin.freeSubscribe(criteria);
		res.sendStatus(httpStatus.OK);
	},

	/** Delete a Admin */
	delete: async (req, res) => {
		const { id } = req.params;
		const result = await Admin.delete(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get Admin by id */
	getById: async (req, res) => {
		const { id } = req.params;
		const result = await Admin.getById(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Login in for user */
	login: async (req, res) => {
		const data = req.body;
		const result = await Admin.login(data);
		res.status(httpStatus.OK).json(result);
	},
};
