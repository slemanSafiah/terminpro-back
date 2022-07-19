const router = require('express').Router();

/*********************************
 * @Router /api/category/ *
 *********************************/
router.use('/category', require('./category/router'));

/*********************************
 * @Router /api/private/template *
 *********************************/
module.exports = router;
