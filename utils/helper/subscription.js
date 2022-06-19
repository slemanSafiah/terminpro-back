const Institution = require('../../src/app/institution/Institution');
const Plan = require('../../src/app/plan/Plan');

module.exports = async () => {
	const today = new Date();
	const todayPlusWeek = new Date();
	const todayMinus3Month = new Date();
	todayPlusWeek.setDate(todayPlusWeek.getDate() + 7);
	todayMinus3Month.setMonth(todayMinus3Month.getMonth() - 3);
	const inst = await Institution.find({ 'subscription.plan': { $ne: null } });
	await Promise.all(
		inst.map((ele) => {
			return new Promise(async (resolve, reject) => {
				const plan = await Plan.findOne({ _id: ele.subscription.plan });
				const length = plan.length;
				const endSubscription = new Date(ele.subscription.start);
				endSubscription.setMonth(endSubscription.getMonth() + length);
				if (endSubscription <= today) {
					//end subscription
					if (endSubscription <= todayMinus3Month) {
						await Institution.updateOne(
							{ _id: ele._id },
							{ $set: { subscription: null, freezed: false, blocked: true } }
						);
						//TODO send sms
						const message =
							'you account is blocked right now , subscribe our plans to retrieve the services';
					} else {
						await Institution.updateOne({ _id: ele._id }, { $set: { subscription: null, freezed: true } });
						//TODO send sms and update notify
						const message =
							'your subscription end today, your account has been notified as freezed, subscribe our plans to retrieve the services';
					}
				} else if (endSubscription <= todayPlusWeek && !ele.notified) {
					//subscription gonna end in  week
					await Institution.updateOne({ _id: ele._id }, { $set: { notified: true } });
					//TODO send sms and update notify
					const message =
						'your subscription will end in a week, subscribe our plans to continue with our services';
				}
			});
		})
	);
};
