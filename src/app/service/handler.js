const _ = require('lodash');
const Service = require('./service');
const { httpStatus } = require('../../../utils');

module.exports = {
	/** Add a new Service */
	save: async (req, res) => {
		const data = req.body;
		const result = await new Service(data).save();
		res.status(httpStatus.CREATED).json(result);
	},

	/** Update a Service */
	update: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		console.log({ 0: req.params, 1: req.body });
		const result = await new Service(data).update(id);
		res.status(httpStatus.UPDATED).json(result);
	},

	/** Delete a Service */
	delete: async (req, res) => {
		const { id } = req.params;
		const result = await Service.delete(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get Service by id */
	getById: async (req, res) => {
		const { id } = req.params;
		const result = await Service.getById(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get institution's services */
	getServices: async (req, res) => {
		const { id } = req.params;
		const result = await Service.getServices(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get Services by criteria */
	getByCriteria: async (req, res) => {
		const criteria = _.pick(req.query, ['name', 'cat', 'sort']);
		const pagination = _.pick(req.query, ['limit', 'skip', 'total']);
		const result = await Service.getByCriteria(criteria, pagination);
		res.status(httpStatus.OK).json(result);
	},
};
