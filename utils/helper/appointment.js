const Institution = require('../../src/app/institution/Institution');
const Appointment = require('../../src/app/appointment/Appointment');
const User = require('../../src/app/user/User');
const pdf = require('pdf-creator-node');
const paths = require('../../paths');
const fs = require('fs').promises;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const { checkDir } = require('./checkdir');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = async () => {
	try {
		const today = new Date();
		const todayDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
		const todayMinusYear = new Date();
		//TODO test again with right data
		todayMinusYear.setFullYear(todayMinusYear.getFullYear() - 1);
		const appointments = await Appointment.find(
			{ createdAt: { $lte: todayMinusYear } },
			'date history user institution'
		)
			.populate('user', 'firstName lastName -_id')
			.populate('institution', 'name -_id')
			.lean();

		let appoints = appointments.map((ele) => {
			let hist = ele.history.toString();
			let appointment = {
				firstName: ele.user.firstName,
				lastName: ele.user.lastName,
				institution: ele.institution.name,
				time: ele.date,
			};
			appointment.day = hist.substr(6, 2);
			appointment.month = hist.substr(4, 2);
			appointment.year = hist.substr(0, 4);
			return appointment;
		});

		//TODO SAVE TO EXTERNAL FILE IN SPECIFIC STYLE
		const path = `${paths.app}/uploads/appointment/${today.getFullYear() - 1}/${
			months[(today.getMonth() - 1 + 12) % 12]
		}/backup.csv`;
		await checkDir(
			`${paths.app}/uploads/appointment/${today.getFullYear() - 1}/${(today.getMonth() - 1 + 12) % 12}`
		);
		await checkDir(path);
		const csvWriter = createCsvWriter({
			path: `${path}`,
			header: [
				{ id: 'time', title: 'Time' },
				{ id: 'year', title: 'Year' },
				{ id: 'month', title: 'Month' },
				{ id: 'day', title: 'Day' },
				{ id: 'firstName', title: 'FirstName' },
				{ id: 'lastName', title: 'LastName' },
				{ id: 'institution', title: 'Institution' },
			],
		});

		csvWriter.writeRecords(appoints).then(() => console.log('The CSV file was written successfully'));

		const result = await Appointment.bulkWrite([
			{
				deleteMany: {
					filter: { createdAt: { $lte: todayMinusYear } },
				},
			},
		]);
	} catch (err) {
		console.log(err);
	}
};
