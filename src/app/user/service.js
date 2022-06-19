const { Exception, httpStatus } = require('../../../utils');
const { generateToken, resetToken, verifyResetToken } = require('../../../utils/token/token');
const bcrypt = require('bcryptjs');
const User = require('./User');
const sendEmail = require('../../../utils/helper/email');
const sendContactUsEmail = require('../../../utils/helper/contactusEmail');
const generateCode = require('../../../utils/helper/generateCode');
const paths = require('../../../paths');

class UserService {
	constructor(data) {
		this.type = data.type;
		this.email = data.email;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.password = data.password;
		this.mobile = data.mobile;
		this.paypal = data.paypal;
		this.category = data.category;
		this.description = data.description;
		this.institutionName = data.institutionName;
		this.location = data.location;
	}

	async save() {
		const user = await User.findOne({ email: this.email });
		if (user !== null) throw new Exception(httpStatus.CONFLICT, 'User Already exists');
		const result = await new User(this).save();
		if (!result) throw new Exception();

		return { data: { id: result._id, firstName: result.firstName, lastName: result.lastName, type: result.type } };
	}

	async update(id) {
		console.log({ id, 1: this });
		const result = await User.findOneAndUpdate({ _id: id }, this, { omitUndefined: true });
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'User not found');
		return;
	}

	static async verify(id, code) {
		const user = await User.findOne({ _id: id });
		if (!user) throw new Exception(httpStatus.NOT_FOUND, 'User not found');
		if (user.verifyCode !== code) throw new Exception(httpStatus.CONFLICT, 'wrong verification code');
		const result = await User.updateOne({ _id: id }, { verified: true });
		if (!result.nModified) throw new Exception(httpStatus.INTERNAL_SERVER_ERROR, 'error');
		return;
	}

	static async changePassword(id, data) {
		const user = await User.findOne({ _id: id });
		if (!user) throw new Exception(httpStatus.NOT_FOUND, 'User not found');
		const result = await User.updateOne({ _id: id }, { password: data.password });
		if (!result.nModified) throw new Exception(httpStatus.INTERNAL_SERVER_ERROR, 'error');
		return;
	}

	static async updatePhoto(id, data) {
		console.log(data);
		const result = await User.findById(id);
		if (!result) return { msg: 'User not found' };
		const updatedImage = await User.updateOne({ _id: id }, { img: data.img });
		if (!updatedImage.nModified) throw new Exception(httpStatus.INTERNAL_SERVER_ERROR, 'error');
		return;
	}

	static async updateGallery(id, data) {
		const result = await User.findById(id);
		if (!result) return { msg: 'User not found' };
		const updatedImage = await User.updateOne({ _id: id }, { $push: { gallery: data.img } });
		if (!updatedImage.nModified) throw new Exception(httpStatus.INTERNAL_SERVER_ERROR, 'error');
		return;
	}

	static async forgetPasswordEmail(email) {
		// add random number to the db
		const user = await User.findOne({ email: email });
		if (!user) return { msg: 'an email sent' };
		const token = await resetToken({ _id: user._id });
		await User.updateOne({ resetToken: token });
		await sendEmail(token, email);
		return;
	}

	static async contactUs(data) {
		await sendContactUsEmail(data.from_subject, data.from_email, data.from_name, data.message);
		return;
	}

	static async resetPassword(token, password) {
		const user = await User.findOne({ resetToken: token });
		if (!user) throw new Exception(httpStatus.NOT_FOUND, 'User not found');

		let decode = await verifyResetToken(token);
		if (!decode) throw new Exception(httpStatus.CONFLICT, 'token is not valid');

		const result = await User.updateOne({ _id: decode._id }, { $set: { password: password, resetToken: '' } });
		if (!result.nModified) throw new Exception(httpStatus.INTERNAL_SERVER_ERROR, 'error in update password');

		return;
	}

	static async delete(id) {
		const result = await User.findOneAndDelete({ _id: id });
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'User not found');
		return { msg: 'done' };
	}

	static async deleteGallery(id, image) {
		const result = await User.findOneAndUpdate({ _id: id }, { $pull: { gallery: image } });
		return { msg: 'done' };
	}

	static async getById(id) {
		//FIXME
		const result = await User.findById(id, '-password');
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'User not found');
		if (result.photo) result.photo = `http://161.35.193.253/media2/${result.photo.slice(9)}`;
		return { data: result };
	}

	static async getByCriteria() {
		const owners = await User.find({ type: 'institution' }).count();
		const all = await User.count();
		return {
			Institutions: owners,
			customers: all - owners,
		};
	}

	static async getInstitutions(category) {
		console.log(category);
		const result = await User.find({ category: category, type: 'institution' });
		return result;
	}

	static async login(data) {
		const result = await User.findOne({ email: data.email });
		if (!result) return { err: 'Email or Password is not correct' };
		let validPassword = await bcrypt.compare(data.password, result.password);
		if (validPassword) {
			const token = await generateToken({
				id: result._id,
				type: result.type,
				firstName: result.firstName,
				lastName: result.lastName,
			});
			let obj = {};
			Object.assign(obj, result);
			console.log(obj._doc);
			delete obj._doc.password;
			return { data: obj._doc, token };
		} else {
			return { err: 'Email or Password is not correct' };
		}
	}

	async signup() {
		const result = await this.save();
		console.log(result);
		const token = await generateToken({
			id: result.data.id,
			type: result.data.type,
			firstName: result.data.firstName,
			lastName: result.data.lastName,
		});
		result.token = token;
		if (!result) throw new Exception(httpStatus.CONFLICT, 'User already exist');

		const code = generateCode();
		await User.updateOne({ _id: result.data.id }, { $set: { verifyCode: code } });
		//TODO send sms with verify code
		const message = `your verification code is ${code}, verify your account to get the best with us`;

		return result;
	}
}

module.exports = UserService;
