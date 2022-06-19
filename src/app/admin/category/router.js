const handler = require('./handler');
const router = require('express').Router();
const Exception = require('../../../../utils/errorHandlers/Exception');
const { auth } = require('../../../../utils/token/authMiddleware');

/*********************************
 * @Router /api/private/template *
 *********************************/

router.post('/', handler.save);

router.put('/:id', auth, Exception.generalErrorHandler(handler.update));

router.delete('/:id', handler.delete);

router.get('/:id', Exception.generalErrorHandler(handler.getById));

router.get('/', handler.getAllCategories);

module.exports = router;
