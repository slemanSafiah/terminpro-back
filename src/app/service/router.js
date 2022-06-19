const Exception = require('../../../utils/errorHandlers/Exception');
const handler = require('./handler');
const router = require('express').Router();
const validator = require('./validator');
const { auth } = require('../../../utils/token/authMiddleware');

/*********************************
 * @Router /api/private/template *
 *********************************/

router.post('/', handler.save);

router.put('/:id', handler.update);

router.delete('/:id', handler.delete);

router.get('/all/:id', handler.getServices);

// router.get('/:id', handler.getById);

// router.get('/', handler.getByCriteria);

module.exports = router;
