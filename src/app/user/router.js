const handler = require('./handler');
const router = require('express').Router();
const { Exception, httpStatus } = require('../../../utils');
const validator = require('./validator');
const { auth } = require('../../../utils/token/authMiddleware');

/*********************************
 * @Router /api/private/template *
 *********************************/
// router.put('/forgetPassword', Exception.generalErrorHandler(handler.forgetPasswordEmail));

// router.put('/resetPassword/:token', Exception.generalErrorHandler(handler.resetPassword));

// router.post('/', auth, validator.save, Exception.generalErrorHandler(handler.save));

// router.post('/contactUs', Exception.generalErrorHandler(handler.contactUs));

// router.put('/:id/verify', auth, validator.paramId, Exception.generalErrorHandler(handler.verify));

// router.delete('/:id/photo', auth, validator.paramId, Exception.generalErrorHandler(handler.deletePhoto));

// router.delete('/:id', auth, validator.paramId, Exception.generalErrorHandler(handler.delete));

// ?
router.get('/institutions', handler.getInstitutions);

router.get('/:id', handler.getById);

router.get('/', handler.getByCriteria);

router.put('/:id/photo', handler.updatePhoto);

router.put('/:id/gallery', handler.updateGallery);

router.put('/:id/changePassword', handler.changePassword);

router.put('/:id', handler.update);

router.post('/signup', handler.signup);

router.post('/login', handler.login);

router.delete('/:id/gallery', handler.deleteGallery);

module.exports = router;
