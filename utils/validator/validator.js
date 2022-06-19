const httpStatus = require('../constants/httpStatus');

module.exports = (Schema) => (req, res, next) => {
	const schema = typeof Schema === 'function' ? Schema(req) : Schema;
	const { params, query, body } = req;
	const validationResult = schema.options({ abortEarly: false }).unknown(true).validate({ params, query, body });
	if (validationResult.error) {
		const errors = validationResult.error.details.flatMap((val) => {
			if (val.type === 'alternatives.match')
				return val.context.details.map((val) => val.message.split('"').join(''));
			return val.message.split('"').join('');
		});
		res.status(httpStatus.VALIDATION_ERROR).json({ msg: 'Input Error.', errors });
	} else {
		req.params = validationResult.value.params;
		req.query = validationResult.value.query;
		req.body = validationResult.value.body;
		next();
	}
};
