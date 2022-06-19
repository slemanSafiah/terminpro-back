process.env.TZ = 'UTC';

module.exports = {
	Exception: require('./errorHandlers/Exception'),
	httpStatus: require('./constants/httpStatus'),
};
