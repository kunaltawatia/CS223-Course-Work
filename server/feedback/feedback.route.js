const express = require('express');
const { validate } = require('express-validation');
const feedbackCtrl = require('./feedback.controller');
const authenticate = require('../middlewares/authentication');

const router = express.Router(); // eslint-disable-line new-cap

router
	.route('/')

	/** POST /api/feedback - Create new feedback */
	.post(authenticate, feedbackCtrl.create);

router
	.route('/:feedbackId')
	/** ALL of the following routes are protected */
	.all(authenticate)

	/** GET /api/feedback/:feedbackId - Get feedback */
	.get(feedbackCtrl.get)

	/** PUT /api/feedback/:feedbackId - Update feedback */
	.put(feedbackCtrl.authorize, feedbackCtrl.update)

	/** DELETE /api/feedback/:feedbackId - Delete feedback */
	.delete(feedbackCtrl.authorize, feedbackCtrl.remove);

/** Load feedback when API with feedbackId route parameter is hit */
router.param('feedbackId', feedbackCtrl.load);

module.exports = router;
