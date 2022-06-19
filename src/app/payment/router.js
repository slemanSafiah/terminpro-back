const router = require('express').Router();
const { httpStatus } = require('../../../utils');
const { auth } = require('../../../utils/token/authMiddleware');
const validator = require('./validator');
const paypal = require('paypal-rest-sdk');
const paymentObject = require('../../../utils/helper/preparePayment');
const Payment = require('./Payment');
const User = require('../user/User');
const mongoose = require('mongoose');
const axios = require('axios');

paypal.configure({
	mode: process.env.MODE,
	client_id: process.env.CLIENT_ID,
	client_secret: process.env.CLIENT_SECRET,
});

/*********************************
 * @Router /api/private/template *
 *********************************/

router.get('/success', async (req, res) => {
	console.log(req.params);
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
	const payment = await Payment.findOne({ paymentId: paymentId });
	console.log({
		0: paymentId,
		1: payerId,
		2: payment,
	});
	const data = {
		payer_id: payerId,
		transactions: [
			{
				amount: {
					currency: 'USD',
					total: payment.price + '.00',
				},
			},
		],
	};

	paypal.payment.execute(paymentId, data, async function (err, payment) {
		const result = await Payment.findOneAndUpdate(
			{ paymentId: paymentId },
			{ done: true },
			{ omitUndefined: true, useFindAndModify: false }
		);
		if (err) {
			throw err;
		}
		res.redirect('http://localhost:3000/success');
	});
});

router.get('/cancel', (req, res) => {
	res.redirect('http://localhost:3000/failure');
});

/**
 * @params id for the owner of institution
 * @body - institutionID and SKU , months
 */
router.post('/subscription/:id', async (req, res) => {
	const data = await paymentObject.prepareSubscription(req.body);
	paypal.payment.create(data.pay, async function (err, payment) {
		if (err) throw err;

		const date = new Date();

		const endDate = date.setMonth(date.getMonth() + req.body.months);
		console.log(req.body);
		const data2save = {
			user: req.params.id,
			institution: req.body.institution,
			start: Date.now(),
			end: endDate,
			price: req.body.price,
			paymentId: payment.id,
			plan: req.body.planName,
		};
		const paymentObj = await Payment.create(data2save);
		console.log(paymentObj);
		for (let i = 0; i < payment.links.length; i++) {
			if (payment.links[i].rel === 'approval_url') {
				res.status(httpStatus.OK).json({ redirect_url: payment.links[i].href });
			}
		}
	});
});

/**
 * @params id for the user
 * @body  -institution and array of services
 */
router.post('/pay/:id', validator.adaptivePayment, validator.paramId, async (req, res) => {
	const data = await paymentObject.preparePayment(req.body);
	const header = {
		'X-PAYPAL-SECURITY-USERID': process.env.USERIDPAYPAL,
		'X-PAYPAL-SECURITY-PASSWORD': process.env.PASSWORD,
		'X-PAYPAL-SECURITY-SIGNATURE': process.env.SIGNATURE,
		'X-PAYPAL-REQUEST-DATA-FORMAT': 'JSON',
		'X-PAYPAL-RESPONSE-DATA-FORMAT': 'JSON',
		'X-PAYPAL-APPLICATION-ID': process.env.APPLICATIONID,
		'X-PAYPAL-SERVICE-VERSION': '1.0.0',
	};
	const result = await axios({
		method: 'POST',
		url: 'https://svcs.sandbox.paypal.com/AdaptivePayments/Pay',
		headers: header,
		data: data,
	});
	console.log(result.data);
	if (result.data.responseEnvelope.ack === 'Success') {
		const payment = new Payment({
			user: req.params.id,
			institution: req.body.institution,
			start: Date.now().toString(),
			end: Date.now().toString(),
			price: req.body.services.reduce((prev, curr) => prev + curr.price, 0),
			done: false,
			paymentId: result.data.payKey,
		});
		await payment.save();
		return res.status(httpStatus.OK).json({
			red_url: `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=${result.data.payKey}`,
		});
	}
	return res.status(httpStatus.BAD_REQUEST).json({ err: result.data.error });
});

router.get('/subscription', async (req, res) => {
	const subs = await Payment.find({
		done: true,
	}).populate('institution', 'institutionName');
	console.log(subs);
	return res.status(200).json({ data: subs, count: await Payment.count() });
});

router.get('/checkValidity/:id', async (req, res) => {
	const result = await Payment.findOne({ institution: req.params.id, user: req.params.id }, 'end');
	if (!result) return res.status(200).json({ end: '' });
	return res.status(200).json({ end: result.end });
});
module.exports = router;
