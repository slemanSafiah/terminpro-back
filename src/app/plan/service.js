const { Exception, httpStatus } = require('../../../utils');
const Plan = require('./Plan');

class PlanService {
	constructor(data) {
		this.sku = data.sku;
		this.name = data.name;
		this.price = data.price;
		this.serviceLimit = data.serviceLimit;
		this.length = data.length;
	}

	async addPlan() {
		const plan = await Plan.findOne({ sku: this.sku });
		if (plan) return { msg: 'plan already exist' };

		const result = await new Plan(this).save();

		return { data: result };
	}

	async updatePlan(id) {
		const plan = await Plan.findOneAndUpdate({ _id: id }, this, { omitUndefined: true });
		if (!plan) throw new Exception(httpStatus.NOT_FOUND, 'Plan are not exists');
		return;
	}

	static async switchStatus(id) {
		const plan = await Plan.findOne({ _id: id });
		if (!plan) throw new Exception(httpStatus.NOT_FOUND, 'Plan are not exists');
		const result = await Plan.updateOne({ _id: id }, { $set: { available: !plan.available } }, { new: true });
		if (!result.nModified) throw new Exception();

		return;
	}

	static async deletePlan(id) {
		const plan = await Plan.findOneAndDelete({ _id: id });
		if (!plan) return { msg: 'Plan are not exists' };
		return;
	}

	static async getPlan(id) {
		const plan = await Plan.findOne({ _id: id });
		if (!plan) throw new Exception(httpStatus.NOT_FOUND, 'Plan are not exists');
		return { result: plan };
	}

	static async getAllPlans() {
		const plans = await Plan.find();
		if (plans.length === 0) return { msg: 'no plans exsist' };
		return plans;
	}
}

module.exports = PlanService;
