const _ = require('lodash');
const Appointment = require('./service');
const { httpStatus } = require('../../../utils');

module.exports = {
	/** Add a new Appointment */
	save: async (req, res) => {
		console.log(req.body);
		const data = req.body;
		const result = await new Appointment(data).save();
		res.status(httpStatus.CREATED).json(result);
	},

	/** Rating an Appointment */
	rate: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await Appointment.rate(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Update a Appointment */
	update: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await new Appointment(data).update(id);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Delete a Appointment */
	delete: async (req, res) => {
		const { id } = req.params;
		const result = await Appointment.delete(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get Appointment by id */
	getById: async (req, res) => {
		const { id } = req.params;
		const result = await Appointment.getById(id);
		res.status(httpStatus.OK).json(result);
	},

	// /** Get Appointments by criteria */
	getByCriteria: async (req, res) => {
		const criteria = _.pick(req.query, ['service', 'user', 'institution', 'history', 'sort']);
		const pagination = _.pick(req.query, ['limit', 'skip', 'total']);
		const result = await Appointment.getByCriteria(criteria, pagination);
		res.status(httpStatus.OK).json(result);
	},
};
