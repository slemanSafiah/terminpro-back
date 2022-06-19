const { Exception, httpStatus } = require('../../../utils');
const Admin = require('./Admin');
const Institution = require('../institution/Institution');
const Plan = require('../plan/Plan');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongoose').Types;
const { generateToken } = require('../../../utils/token/token');

class AdminService {
	constructor(data) {
		this.email = data.email;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.password = data.password;
	}

	async save() {
		const admin = await Admin.findOne({ email: this.email });
		if (admin) throw new Exception(httpStatus.CONFLICT, 'admin already exists');

		const result = await new Admin(this).save();
		if (!result) throw new Exception();

		return { data: { id: result._id } };
	}

	async update(id) {
		const admin = await Admin.findOne({ _id: id });
		if (!admin) throw new Exception(httpStatus.CONFLICT, 'admin not found');

		const result = await Admin.updateOne({ _id: id }, this, {
			omitUndefined: true,
			useFindAndModify: false,
			new: true,
		});
		if (!result.nModified) throw new Exception(httpStatus.INTERNAL_SERVER_ERROR, 'Error in update Admin data');

		return { data: result };
	}

	static async freeSubscribe(data) {
		const plan = await Plan.findOne({ _id: ObjectId(data.plan) });
		if (!plan) throw new Exception(httpStatus.NOT_FOUND, 'Plan not found');

		const institution = await Institution.findOne({ _id: ObjectId(data.inst) });
		if (!institution) throw new Exception(httpStatus.NOT_FOUND, 'Institution not found');

		const result = await Institution.updateOne(
			{ _id: ObjectId(data.inst) },
			{
				$set: {
					subscription: {
						plan: ObjectId(data.plan),
						start: Date.now(),
					},
					notified: false,
				},
			}
		);

		if (!result.nModified) throw new Exception();
		return;
	}

	static async delete(id) {
		const result = await Admin.findOneAndDelete({ _id: id });
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Admin not found');
		return { msg: 'done' };
	}

	static async getById(id) {
		const result = await Admin.findById(id, '-password');
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Admin not found');
		return { data: result };
	}

	static async login(data) {
		const result = await Admin.findOne({ email: data.email });
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Admin not found');
		let validPassword = await bcrypt.compare(data.password, result.password);
		if (validPassword) {
			const token = await generateToken({ id: result._id });
			const data = {
				_id: result._id,
				email: result.email,
				firstName: result.firstName,
				lastName: result.lastName,
			};
			return { data, token };
		}
		throw new Exception(httpStatus.NOT_FOUND, 'wrong password');
	}
}

module.exports = AdminService;
