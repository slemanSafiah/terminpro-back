const handler = require('./handler');
const router = require('express').Router();
const Exception = require('../../../utils/errorHandlers/Exception');
const validator = require('./validator');
const { auth } = require('../../../utils/token/authMiddleware');

/*********************************
 * @Router /api/private/template *
 *********************************/

router.post('/', handler.save);

router.delete('/:id', auth, validator.paramId, Exception.generalErrorHandler(handler.delete));

router.get('/:id', handler.getById);

router.get('/', handler.getByCriteria);

module.exports = router;
