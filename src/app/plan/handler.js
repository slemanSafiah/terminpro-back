const { httpStatus } = require('../../../utils');
const Plan = require('./service');

module.exports = {
	/** Add a new Plan */
	addPlan: async (req, res) => {
		const data = req.body;
		const result = await new Plan(data).addPlan();
		res.status(httpStatus.CREATED).json(result);
	},

	/** Update a Plan */
	updatePlan: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await new Plan(data).updatePlan(id);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Toggle the available Property */
	switchStatus: async (req, res) => {
		const { id } = req.params;
		const result = await Plan.switchStatus(id);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Delete a Plan */
	deletePlan: async (req, res) => {
		const { id } = req.params;
		const result = await Plan.deletePlan(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get Plan by id */
	getPlan: async (req, res) => {
		const { id } = req.params;
		const result = await Plan.getPlan(id);
		res.status(httpStatus.OK).json(result);
	},

	// /** Get all Plans*/
	getAllPlans: async (req, res) => {
		const result = await Plan.getAllPlans();
		res.status(httpStatus.OK).json(result);
	},
};
