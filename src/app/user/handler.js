const _ = require('lodash');
const User = require('./service');
const { httpStatus } = require('../../../utils');

module.exports = {
	/** Add a new User */
	save: async (req, res) => {
		const data = req.body;
		const result = await new User(data).save();
		res.status(httpStatus.CREATED).json(result);
	},

	/** Update a User */
	update: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		console.log(id, data);
		await new User(data).update(id);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Verify User */
	verify: async (req, res) => {
		const { id } = req.params;
		const code = req.body.code;
		await User.verify(id, code);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Update a photo */
	updatePhoto: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await User.updatePhoto(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Update Gallery */
	updateGallery: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await User.updateGallery(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** change Password */
	changePassword: async (req, res) => {
		const { id } = req.params;
		const data = req.body;
		await User.changePassword(id, data);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** forgot Password */
	forgetPasswordEmail: async (req, res) => {
		const data = req.body.email;
		const result = await User.forgetPasswordEmail(data);
		res.status(httpStatus.OK).json(result);
	},

	/** Reset Password */
	resetPassword: async (req, res) => {
		const { token } = req.params;
		const password = req.body.password;
		const result = await User.resetPassword(token, password);
		res.status(httpStatus.UPDATED).json(result);
	},

	/** contact Us Email */
	contactUs: async (req, res) => {
		const data = req.body;
		const result = await User.contactUs(data);
		res.status(httpStatus.OK).json({ msg: 'email sent successfully' });
	},

	/** delete a photo */
	deletePhoto: async (req, res) => {
		const { id } = req.params;
		await User.deletePhoto(id);
		res.sendStatus(httpStatus.UPDATED);
	},

	/** Delete a User */
	delete: async (req, res) => {
		const { id } = req.params;
		const result = await User.delete(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Delete image from gallery */
	deleteGallery: async (req, res) => {
		const { id } = req.params;
		const image = req.body.img;
		await User.deleteGallery(id, image);
		res.sendStatus(httpStatus.DELETED);
	},

	/** Get User by id */
	getById: async (req, res) => {
		const { id } = req.params;
		const result = await User.getById(id);
		res.status(httpStatus.OK).json(result);
	},

	/** Get Users by criteria */
	getByCriteria: async (req, res) => {
		const result = await User.getByCriteria();
		res.status(httpStatus.OK).json(result);
	},

	/** Get insitutions but category */
	getInstitutions: async (req, res) => {
		const result = await User.getInstitutions(req.query.cat);
		res.status(httpStatus.OK).json(result);
	},

	/** Sign up for user */
	signup: async (req, res) => {
		const data = req.body;
		const result = await new User(data).signup();
		res.status(httpStatus.CREATED).json(result);
	},

	/** Login in for user */
	login: async (req, res) => {
		const data = req.body;
		const result = await User.login(data);
		res.status(httpStatus.OK).json(result);
	},
};
