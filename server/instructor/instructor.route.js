const express = require('express');
const profileCtrl = require('./instructor.controller');

const router = express.Router(); // eslint-disable-line new-cap

router
	.route('/:instructorId')
	/** GET /api/instructor/:instructorId - Get instructor profile */
	.get(profileCtrl.get);

/** Load articles when API with articleId route parameter is hit */
router.param('instructorId', profileCtrl.load);

module.exports = router;
