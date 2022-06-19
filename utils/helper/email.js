const axios = require('axios');

module.exports = async (token, email) => {
	const link = `http://localhost:8080/resetpass?token=${token}`;

	const data = {
		service_id: process.env.SERVICEID,
		template_id: process.env.TEMPLATEID,
		user_id: process.env.USERID,
		template_params: {
			email: email,
			link: link,
		},
		accessToken: process.env.ACCESSTOKEN,
	};

	await axios({
		method: 'POST',
		url: 'https://api.emailjs.com/api/v1.0/email/send',
		headers: {
			'Content-Type': 'application/json',
		},
		data: data,
	}).then(
		(response) => {
			console.log('SUCCESS!', response.status, response.data);
		},
		function (error) {
			console.log('FAILED...', error.response.data);
		}
	);
};
