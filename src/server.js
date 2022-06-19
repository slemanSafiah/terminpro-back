const { Exception } = require('../utils');
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cron = require('node-cron');
const cors = require('cors');
const checkSubscription = require('../utils/helper/subscription');
const checkAppointment = require('../utils/helper/appointment');

const app = express();

//cron.schedule('*/10 * * * * *', checkSubscription);
//cron.schedule('*/10 * * * * *', checkAppointment);

// initial dotenv
dotenv.config();

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: false }));

// parse json request body
app.use(bodyParser.json({ limit: '50mb' }));

//************************** Access Origin ****************************************/
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
	next();
});

// enable cors
app.use(cors());
app.options('*', cors());

app.get('/test', (req, res) => res.status(200).json({ msg: 'welcome' }));

app.use('/api', require('./app/router'));

app.use(Exception.requestDefaultHandler);

//************************ Connect To DB *****************************************/

mongoose.connect(process.env.MongoDB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	keepAlive: true,
	socketTimeoutMS: 36000,
	connectTimeoutMS: 36000,
});
mongoose.connection.on('open', () => {
	console.log('Connect to DB .....');
});
mongoose.connection.on('error', (err) => {
	console.log('Error in DB ...\n', err);
});

//************************ Create SERVER *****************************************/
const port = process.env.PORT || 5001;

app.listen(process.env.PORT, () => {
	console.info(`Server is listening on port ${process.env.PORT}`);
});
