const handler = require('./handler');
const router = require('express').Router();
const Exception = require('../../../utils/errorHandlers/Exception');
const validator = require('./validator');
const { auth } = require('../../../utils/token/authMiddleware');

/*********************************
 * @Router /api/private/template *
 *********************************/

router.post('/', auth, validator.save, Exception.generalErrorHandler(handler.save));

router.put('/:id', auth, validator.update, Exception.generalErrorHandler(handler.update));

router.put('/:id/subscribe', auth, validator.paramId, Exception.generalErrorHandler(handler.subscribe));

router.put('/:id/unsubscribe', auth, validator.paramId, Exception.generalErrorHandler(handler.unsubscribe));

router.put('/:id/rate', auth, validator.rate, Exception.generalErrorHandler(handler.rate));

router.put('/:id/photo', auth, validator.paramId, Exception.generalErrorHandler(handler.updatePhoto));

router.put('/:id/slider', auth, validator.paramId, Exception.generalErrorHandler(handler.addToSlider));

router.delete('/:id/slider', auth, validator.paramId, Exception.generalErrorHandler(handler.deleteFromSlider));

router.delete('/:id/photo', auth, validator.paramId, Exception.generalErrorHandler(handler.deletePhoto));

router.delete('/:id', auth, validator.paramId, Exception.generalErrorHandler(handler.delete));

router.get('/:id/plan', auth, validator.paramId, Exception.generalErrorHandler(handler.getByPlan));

router.get('/:id/owner', auth, validator.paramId, Exception.generalErrorHandler(handler.getByOwner));

router.get('/:id', validator.paramId, Exception.generalErrorHandler(handler.getById));

router.get('/', validator.getByCriteria, Exception.generalErrorHandler(handler.getByCriteria));

module.exports = router;
