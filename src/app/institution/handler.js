const _ = require('lodash');
const Institution = require('./service');
const { httpStatus } = require('../../../utils');

module.exports = {
	/** Add a new Institution */
	save: async (req, res) => {
		const data = req.body;
		const result = await new Institution(data).save();
		res.status(httpStatus.CREATED).json(result);
	},

	/** Rating an Institution */
	rate: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await Institution.rate(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Update a Institution */
	update: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await new Institution(data).update(id);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Update a photo */
	updatePhoto: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await Institution.updatePhoto(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** add subscription to Institution */
	subscribe: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await Institution.subscribe(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** delete subscription from Institution */
	unsubscribe: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await Institution.unsubscribe(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Add image to a slider */
	addToSlider: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await Institution.addToSlider(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** delete a photo */
	deletePhoto: async (req, res) => {
		const { id } = req.params;
		await Institution.deletePhoto(id);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** delete institution */
	delete: async (req, res) => {
		const { id } = req.params;
		await Institution.delete(id);
		res.sendStatus(httpStatus.OK);
	},

	/** Delete image from slider */
	deleteFromSlider: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await Institution.deleteFromSlider(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Get Institution by id */
	getById: async (req, res) => {
		const { id } = req.params;
		const result = await Institution.getById(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get Institutions by plan */
	getByPlan: async (req, res) => {
		const { id } = req.params;
		const result = await Institution.getByPlan(id);
		res.status(httpStatus.OK).json(result);
	},

	getByOwner: async (req, res) => {
		const { id } = req.params;
		const result = await Institution.getByOwner(id);
		res.status(httpStatus.OK).json(result);
	},

	// /** Get Institutions by criteria */
	getByCriteria: async (req, res) => {
		const criteria = _.pick(req.query, ['name', 'cat', 'subCat', 'sort']);
		const pagination = _.pick(req.query, ['limit', 'skip', 'total']);
		const result = await Institution.getByCriteria(criteria, pagination);
		res.status(httpStatus.OK).json(result);
	},
};
