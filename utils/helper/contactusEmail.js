const axios = require('axios');

module.exports = async (from_subject, from_email, from_name, message) => {
	const data = {
		service_id: process.env.SERVICEID,
		template_id: process.env.TEMPLATEID2,
		user_id: process.env.USERID,
		template_params: {
			email: process.env.Email, //the email of the company
			from_subject: from_subject,
			from_email: from_email,
			from_name: from_name,
			message: message,
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
