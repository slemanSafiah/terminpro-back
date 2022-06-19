const { Exception, httpStatus } = require('../../../utils');
const mongoose = require('mongoose');
const Employee = require('./Employee');
const User = require('../user/User');
const Plan = require('../plan/Plan');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../../utils/token/token');
const Institution = require('../institution/Institution');
const Service = require('../service/Services');
const Appointment = require('../appointment/Appointment');
const _ = require('lodash');
const paths = require('../../../paths');
const fs = require('fs').promises;

async function uploadImage(photo) {
	let image = Buffer.from(photo, 'base64');
	let fileName = Date.now().toString() + '.jpg';
	await fs.writeFile(`./uploads/employee/${fileName}`, image);
	return `/uploads/employee/${fileName}`;
}
class EmployeeService {
	constructor(data) {
		this.institution = data.institution;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.email = data.email;
		this.specialty = data.specialty;
		this.password = data.password;
		this.photo = data.photo;
	}

	async save() {
		const emp = await Employee.findOne({ email: this.email });

		if (emp) throw new Exception(httpStatus.CONFLICT, 'Employee already exists');

		const institution = await Institution.findOne({ _id: this.institution }, 'subscription');

		if (!institution) throw new Exception(httpStatus.NOT_FOUND, 'institution not found');

		if (!institution.subscription.plan)
			throw new Exception(httpStatus.NOT_FOUND, 'you must subscribe a plan before add service');

		const plan = await Plan.findOne({ _id: institution.subscription.plan });

		const employees = await Employee.countDocuments({ institution: this.institution });

		if (employees === plan.employeeLimit) {
			throw new Exception(
				httpStatus.BAD_REQUEST,
				'you have reach the limit to add new employee , update subscription to be able to complete this process'
			);
		}

		if (this.photo) this.photo = await uploadImage(this.photo);

		const result = await new Employee(this).save();

		if (!result) throw new Exception();

		return { data: { id: result.id } };
	}

	async update(id) {
		if (this.photo) this.photo = Buffer.from(this.photo, 'base64');

		const result = await Employee.updateOne({ _id: id }, this, { omitUndefined: true });
		return;
	}

	static async updatePhoto(id, data) {
		if (data.photo) {
			const photo = await uploadImage(data.photo);
			const result = await Employee.findOneAndUpdate(
				{ _id: id },
				{ photo: photo },
				{
					omitUndefined: true,
					new: false,
					useFindAndModify: false,
				}
			);
			if (result.photo) await fs.unlink(`${paths.app}/${result.photo}`);
		}
		return;
	}

	static async rate(id, data) {
		const session = await mongoose.startSession();
		await session.withTransaction(async (session) => {
			const user = await User.findOne({ _id: mongoose.Types.ObjectId(data.id) });
			if (!user) throw new Exception(httpStatus.NOT_FOUND, 'User Not Found');
			const inst = await Employee.findOne({ _id: id });
			if (!inst) throw new Exception(httpStatus.NOT_FOUND, 'Employee Not Found');

			await Employee.updateOne(
				{ _id: id },
				{
					$pull: {
						rating: {
							user: data.id,
						},
					},
				},
				{ session }
			);
			const result = await Employee.updateOne(
				{ _id: id },
				{
					$push: {
						rating: {
							user: mongoose.Types.ObjectId(data.id),
							rate: data.rate,
							ratedAt: Date.now(),
						},
					},
				},
				{ session }
			);
			if (!result.nModified) throw new Exception();
		});
		return;
	}

	static async delete(id) {
		const result = await Employee.findOneAndDelete({ _id: id }, { useFindAndModify: false, new: false });
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Employee not found');
		if (result.photo) await fs.unlink(`${paths.app}/${result.photo}`);
		return { msg: 'done' };
	}

	static async deletePhoto(id) {
		const result = await Employee.findOneAndUpdate({ _id: id }, { photo: null }, { useFindAndModify: false });
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Employee not found');
		await fs.unlink(`${paths.app}/${result.photo}`);
		return;
	}

	static async getById(id) {
		//FIXME
		const result = await Employee.findOne({ _id: id }, '-password');
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Employee not found');
		const data = result.toObject({ virtuals: true });
		delete data.rating;
		if (result.photo) data.photo = `http://161.35.193.253/media2/${data.photo.slice(9)}`;
		return { data: data };
	}

	static async getAvailableTimes(id) {
		const emp = await Employee.findOne({ _id: id });
		const inst = await Institution.findOne({ _id: emp.institution });
		const start = inst.openAt;
		const end = inst.closeAt;

		let times = this.initialTimes(start, end);
		let appointments = await Appointment.find({ employee: id }, 'date service -_id');
		let busyTimes = await Promise.all(
			appointments.map((app) => {
				return new Promise(async (resolve, reject) => {
					let servicePromise = await Promise.all(
						app.service.map((serv) => {
							return new Promise(async (resolve, reject) => {
								let service = await Service.findOne({ _id: serv }, 'length'); //1.5

								resolve({ startTime: app.date, length: service.length });
							});
						})
					);
					let time = servicePromise.reduce((acc, curr) => {
						return (acc += curr.length);
					}, 0);
					resolve({ start: servicePromise[0].startTime, total: time });
				});
			})
		);

		busyTimes = busyTimes.map((ele) => {
			let addMin = (ele.total - Math.floor(ele.total)) * 60; //30
			if (addMin === 0) addMin = 0;
			else if (addMin > 0 && addMin <= 15) addMin = 15;
			else if (addMin > 15 && addMin <= 30) addMin = 30;
			else if (addMin > 30 && addMin <= 45) addMin = 45;
			else addMin = 60;
			let addHour = Math.floor(ele.total); //1
			let time = ele.start.split(':'); //['12 ' , ' 30']

			let startHour = parseInt(time[0]) + addHour; //12+1 = 13
			let startMin = parseInt(time[1]) + addMin; //30+30 = 60

			if (startMin >= 60) {
				startHour += Math.floor(startMin / 60);
				startMin -= 60 * Math.floor(startMin / 60);
			}

			return this.initialTimes(parseInt(time[0]) + parseInt(time[1]) / 60, startHour + startMin / 60);
		});
		busyTimes = _.flatten(busyTimes);
		let newTimes = _.pullAll(times, busyTimes);
		times = this.normalizeTimes(newTimes);

		return times;
	}

	static async getEmployees(id) {
		const result = await Employee.find({ institution: id }, '-password');
		//FIXME
		let data = await Promise.all(
			result.map((emp) => {
				return new Promise(async (resolve, reject) => {
					let employee = emp.toObject({ virtuals: true });
					delete employee.rating;
					if (isNaN(employee.rate)) employee.rate = 0;
					if (emp.photo) emp.photo = `http://161.35.193.253/media2/${emp.photo.slice(9)}`;
					resolve(emp);
				});
			})
		);

		return { data: data };
	}

	static async getByCriteria(criteria, { limit, skip, total }) {
		let condition = (() => {
			let result = {};
			if (criteria.fn) result['firstName'] = { $regex: criteria.fn, $options: 'i' };
			if (criteria.ln) result['lastName'] = { $regex: criteria.ln, $options: 'i' };
			if (criteria.specialty) result['specialty'] = { $regex: criteria.specialty, $options: 'i' };
			return result;
		})();
		const result = await Employee.find(condition, '-rating -password -email', { limit, skip })
			.sort({ firstName: criteria.sort })
			.sort({ lastName: criteria.sort })
			.lean();
		//FIXME
		let resultWithImage = await Promise.all(
			result.map((emp) => {
				return new Promise(async (resolve, reject) => {
					if (emp.photo) emp.photo = `http://161.35.193.253/media2/${emp.photo.slice(9)}`;
					resolve(emp);
				});
			})
		);

		let data = { data: resultWithImage };
		if (total) {
			data.total = await Employee.countDocuments({});
		}
		return data;
	}

	static async login(data) {
		//FIXME
		const result = await Employee.findOne({ email: data.email });
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Employee not found');
		let validPassword = await bcrypt.compare(data.password, result.password);
		if (validPassword) {
			const token = await generateToken({ id: result._id });
			const data = {
				_id: result._id,
				email: result.email,
				firstName: result.firstName,
				lastName: result.lastName,
				photo: result.photo,
				specialty: result.specialty,
			};
			data.photo = `http://161.35.193.253/media2/${data.photo.slice(9)}`;
			return { data, token };
		}
		throw new Exception(httpStatus.NOT_FOUND, 'wrong password');
	}

	static initialTimes(start, end) {
		let times = [];
		for (let i = start; i < end; i += 0.25) {
			times.push(i);
		}

		return times;
	}

	static normalizeTimes(times) {
		const normalizedTimes = times.map((ele) => {
			let minute = (ele - Math.floor(ele)) * 60;
			let hour = Math.floor(ele);
			let time = hour.toString() + ' : ' + (minute == 0 ? '00' : minute.toString());
			return time;
		});
		return normalizedTimes;
	}
}

module.exports = EmployeeService;
