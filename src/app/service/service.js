const { Exception, httpStatus } = require('../../../utils');
const User = require('../user/User');
const Service = require('./Services');
const Plan = require('../plan/Plan');
const Payment = require('../payment/Payment');

class ServicesService {
	constructor(data) {
		this.name = data.name;
		this.institution = data.institution;
		this.description = data.description;
		this.time = data.time;
		this.price = data.price;
		this.retainer = data.retainer;
		this.hasRetainer = data.hasRetainer;
	}

	async save() {
		const institution = await User.findOne({ _id: this.institution }, 'subscription');

		if (!institution) throw new Exception(httpStatus.NOT_FOUND, 'institution not found');

		const plan = await Payment.findOne({
			user: this.institution,
			institution: this.institution,
			end: {
				$gte: Date.now(),
			},
		});

		if (!plan) {
			return { msg: 'You must Subscribe to a plan First' };
		}

		const services = await Service.countDocuments({ institution: this.institution });

		const limit = await Plan.findOne({ name: plan.plan });
		console.log(limit, plan);
		if (services === limit.serviceLimit) {
			return {
				msg: 'you have reach the limit to add new service , update subscription to be able to complete this process',
			};
		}

		const result = await new Service(this).save();

		if (!result) throw new Exception();

		return result;
	}

	async update(id) {
		const result = await Service.findByIdAndUpdate(id, this, { omitUndefined: true, new: true });
		return result;
	}

	static async delete(id) {
		const result = await Service.findByIdAndDelete({ _id: id });
		return;
	}

	static async getById(id) {
		const result = await Service.findById(id).populate(
			'institution',
			'openingDays name description address rating'
		);
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Service not found');
		return { data: result };
	}

	static async getServices(id) {
		const result = await Service.find({ institution: id });
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Service not found');
		return { data: result };
	}

	static async getByCriteria(criteria, { limit, skip, total }) {
		let condition = (() => {
			let result = {};
			if (criteria.name) result['name'] = { $regex: criteria.name, $options: 'i' };
			if (criteria.cat) result['category'] = { $regex: criteria.cat, $options: 'i' };
			return result;
		})();
		const result = await Service.find(condition, '', { limit, skip }).sort({ name: criteria.sort }).lean();
		let data = { data: result };
		if (total) {
			data.total = await Service.countDocuments({});
		}
		return data;
	}
}

module.exports = ServicesService;
