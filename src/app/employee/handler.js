const _ = require('lodash');
const Employee = require('./service');
const { httpStatus } = require('../../../utils');

module.exports = {
	/** Add a new Employee */
	save: async (req, res) => {
		const data = req.body;
		const result = await new Employee(data).save();
		res.status(httpStatus.CREATED).json(result);
	},

	/** Rating an Employee */
	rate: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await Employee.rate(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Update a Employee */
	update: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await new Employee(data).update(id);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Update a photo */
	updatePhoto: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await Employee.updatePhoto(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** delete a photo */
	deletePhoto: async (req, res) => {
		const { id } = req.params;
		await Employee.deletePhoto(id);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Delete a Employee */
	delete: async (req, res) => {
		const { id } = req.params;
		const result = await Employee.delete(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get Employee by id */
	getById: async (req, res) => {
		const { id } = req.params;
		const result = await Employee.getById(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get time to work */
	getAvailableTimes: async (req, res) => {
		const { id } = req.params;
		const result = await Employee.getAvailableTimes(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Login in for user */
	login: async (req, res) => {
		const data = req.body;
		const result = await Employee.login(data);
		res.status(httpStatus.OK).json(result);
	},

	/** Get Employees of an institution */
	getEmployees: async (req, res) => {
		const { id } = req.params;
		const result = await Employee.getEmployees(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get Employees by criteria */
	getByCriteria: async (req, res) => {
		const criteria = _.pick(req.query, ['fn', 'ln', 'specialty', 'sort']);
		const pagination = _.pick(req.query, ['limit', 'skip', 'total']);
		const result = await Employee.getByCriteria(criteria, pagination);
		res.status(httpStatus.OK).json(result);
	},
};
