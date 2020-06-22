const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const { StudentSchema } = require('../student/student.model');
const { InstructorSchema } = require('../instructor/instructor.model');

/**
 * Feedback Schema
 */
const FeedbackSchema = new mongoose.Schema({
	body: {
		type: String,
		required: true,
	},
	student: StudentSchema,
	instructor: InstructorSchema,
});

/**
 * Statics
 */
FeedbackSchema.statics = {
	/**
	 * Get feedback
	 * @param {ObjectId} id - The objectId of feedback.
	 * @returns {Promise<Feedback, APIError>}
	 */
	get(id) {
		return this.findById(id)
			.exec()
			.then((feedback) => {
				if (feedback) {
					return feedback;
				}
				const err = new APIError(
					'No such feedback exists!',
					httpStatus.BAD_REQUEST,
					true,
				);
				return Promise.reject(err);
			});
	},
};

/**
 * @typedef Feedback
 */
module.exports = mongoose.model('Feedback', FeedbackSchema, 'feedbacks');
