const express = require('express');
const authRoutes = require('./server/auth/auth.route');
const feedbackRoutes = require('./server/feedback/feedback.route');
const studentRoutes = require('./server/student/student.route');
const instructorRoutes = require('./server/instructor/instructor.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount auth routes at /auth
router.use('/auth', authRoutes);

// feedback routes
router.use('/feedback', feedbackRoutes);

// profile routes
router.use('/student', studentRoutes);
router.use('/instructor', instructorRoutes);

module.exports = router;
