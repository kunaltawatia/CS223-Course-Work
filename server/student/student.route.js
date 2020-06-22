const express = require('express');
const profileCtrl = require('./student.controller');

const router = express.Router(); // eslint-disable-line new-cap

router
	.route('/:studentId')
	/** GET /api/student/:studentId - Get student profile */
	.get(profileCtrl.get);

/** Load articles when API with articleId route parameter is hit */
router.param('studentId', profileCtrl.load);

module.exports = router;
