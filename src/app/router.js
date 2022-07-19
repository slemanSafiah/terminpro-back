const router = require('express').Router();

/************************
 * @Router /api/private *
 ************************/

router.use('/user', require('./user/router'));
router.use('/service', require('./service/router'));
router.use('/appointment', require('./appointment/router'));
router.use('/payment', require('./payment/router'));
router.use('/plan', require('./plan/router'));
router.use('/admin', require('./admin/router'));
module.exports = router;
