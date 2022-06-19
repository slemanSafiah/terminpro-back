const { Exception, httpStatus } = require('../../../utils');
const mongoose = require('mongoose');
const Appointment = require('./Appointment');
const User = require('../user/User');
const Service = require('../service/Services');

class AppointmentService {
	constructor(data) {
		this.date = data.date;
		this.history = data.history;
		this.service = data.service;
		this.institution = data.institution;
		this.user = data.user;
	}

	async save() {
		const user = await User.findOne({ _id: this.user });
		if (!user) throw new Exception(httpStatus.CONFLICT, 'User not found');
		const result = await new Appointment(this).save();
		if (!result) return { msg: 'error' };
		return { data: { id: result.id } };
	}

	static async delete(id) {
		const result = await Appointment.findOneAndDelete({ _id: id });
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Appointment not found');
		return { msg: 'done' };
	}

	static async getById(id) {
		const result = await Appointment.findById(id)
			.populate('institution', 'openingDays name description address rating')
			.populate('employee', 'firstName lastName rating specialty')
			.populate('service', 'name description length price');
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Appointment not found');
		return { data: result };
	}

	static async getByCriteria(criteria, { limit, skip, total }) {
		let condition = (() => {
			let result = {};
			if (criteria.institution) result['institution'] = criteria.institution;
			if (criteria.user) result['user'] = criteria.user;
			return result;
		})();
		console.log(condition);
		const result = await Appointment.find(condition, '', { limit, skip })
			.populate('institution', 'institutionName')
			.populate('user', 'firstName lastName email')
			.populate('service', 'name description time price')
			.sort({ history: criteria.sort })
			.sort({ date: criteria.sort })
			.lean();
		let data = { data: result };
		if (total) {
			data.total = await Appointment.countDocuments({});
		}
		return data;
	}
}

module.exports = AppointmentService;
