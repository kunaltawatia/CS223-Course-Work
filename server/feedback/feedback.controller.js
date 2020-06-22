const mongoose = require('mongoose');
const Feedback = require('./feedback.model');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const Student = require('../student/student.model');
const Instructor = require('../instructor/instructor.model');

/**
 * Load feedbacks and append to req.
 */
function load(req, res, next, id) {
	Feedback.get(id)
		.then((feedback) => {
			req.feedback = feedback;
			return next();
		})
		.catch((e) => next(e));
}

/**
 * Authorize permission to perform action
 * on the loaded feedback by requesting user
 *
 * @param {object} req.feedback 	//	loaded feedback to perform operation
 * @param {object} req.user		//	requesting user
 */
function authorize(req, res, next) {
	if (req.feedback.student._id.toString() !== req.user.databaseId) {
		return next(
			new APIError(
				'Not authorized to perform this action',
				httpStatus.UNAUTHORIZED,
				true,
			),
		);
	}
	next();
}

/**
 * Get feedback
 * @returns {Feedback}
 */
function get(req, res, next) {
	const { user, feedback } = req;
	if (
		(user.role === 'student' &&
			user.databaseId === feedback.student._id.toString()) ||
		(user.role === 'instructor' &&
			user.databaseId === feedback.instructor._id.toString())
	) {
		if (user.role === 'instructor') {
			delete feedback._doc.student;
		}
		res.json({ feedback });
	} else {
		next(
			new APIError(
				'Not allowed to view this feedback.',
				httpStatus.UNAUTHORIZED,
				true,
			),
		);
	}
}

/**
 * Create new feedback
 * @property {string} req.body.body - The text of feedback.
 * The database ID of the instructor for which the feedback  is for.
 * @property {string} req.body.instructorId
 * @property {object} req.user - The authenticated user posting.
 * @returns {Feedback}
 */
async function create(req, res, next) {
	const { body, instructorId } = req.body;

	try {
		student = await Student.get(req.user.databaseId);
		instructor = await Instructor.get(instructorId);

		feedbackEntry = new Feedback({
			body,
			student,
			instructor,
		});

		feedback = await feedbackEntry.save();

		res.json({
			feedback,
		});
	} catch (e) {
		next(
			new APIError(
				'Error while creating the document.',
				httpStatus.BAD_REQUEST,
				true,
			),
		);
	}
}

/**
 * Update existing feedback
 * @property {string} req.body.body - The body of feedback to update.
 * @returns {Feedback}
 */
async function update(req, res, next) {
	try {
		const feedback = req.feedback;
		const { body } = req.body;

		feedback.body = body;
		savedFeedback = await feedback.save();
		res.json({
			feedback: savedFeedback,
		});
	} catch (e) {
		next(
			new APIError(
				'Error while updating the document.',
				httpStatus.BAD_REQUEST,
				true,
			),
		);
	}
}

/**
 * Delete feedback.
 * @returns {Feedback}
 */
function remove(req, res, next) {
	const feedback = req.feedback;
	feedback
		.remove()
		.then((deletedFeedback) => res.json({ feedback: deletedFeedback }));
}

module.exports = {
	authorize,
	load,
	get,
	create,
	update,
	remove,
};
