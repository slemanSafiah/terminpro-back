const { verify } = require('./token');
const { Exception, httpStatus } = require('../index');

exports.auth = async (req, res, next) => {
	let token = null;
	if (req.headers.authorization) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'invalid token' });

	try {
		if (!(await verify(token))) return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'invalid token' });
		else {
			req.user = await verify(token);
			next();
		}
	} catch (error) {
		return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'error : invalid token' });
	}
};
