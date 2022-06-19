const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

exports.generateToken = async (payload) => {
	try {
		let token = await jwt.sign(payload, secret);
		return token;
	} catch (ex) {
		console.log(ex);
		return false;
	}
};

exports.verify = async (token) => {
	try {
		let decode = await jwt.verify(token, secret);
		return decode;
	} catch (ex) {
		return false;
	}
};

exports.resetToken = async (payload) => {
	try {
		let token = await jwt.sign(payload, secret, { expiresIn: '1h' });
		return token;
	} catch (ex) {
		console.log(ex);
		return false;
	}
};

exports.verifyResetToken = async (token) => {
	try {
		let decode = await jwt.verify(token, secret);
		return decode;
	} catch (ex) {
		return false;
	}
};
//we will use symmetric key until next step we generate public/private key
