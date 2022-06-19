const handler = require('./handler');
const router = require('express').Router();
const Exception = require('../../../utils/errorHandlers/Exception');
const validator = require('./validator');
const { auth } = require('../../../utils/token/authMiddleware');

/*********************************
 * @Router /api/category/ *
 *********************************/
router.use('/category', require('./category/router'));

/*********************************
 * @Router /api/private/template *
 *********************************/

router.post('/', auth, validator.save, Exception.generalErrorHandler(handler.save));

router.put('/freeSubscribe', auth, Exception.generalErrorHandler(handler.freeSubscribe));

router.put('/:id', auth, validator.update, Exception.generalErrorHandler(handler.update));

router.delete('/:id', auth, validator.paramId, Exception.generalErrorHandler(handler.delete));

router.get('/:id', validator.paramId, Exception.generalErrorHandler(handler.getById));

router.post('/login', validator.login, Exception.generalErrorHandler(handler.login));

module.exports = router;
