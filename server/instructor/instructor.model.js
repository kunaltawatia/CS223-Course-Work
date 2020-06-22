const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Instructor Schema
 */
const InstructorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		match: [
			/^((([a-z]{1,}\.[0-9]{1,})|([a-z]{1,}))@iitj\.ac\.in)$/,
			'The value of {PATH} {VALUE} is not a valid iitj email id.',
		],
	},
	department: {
		type: String,
		required: true,
	},
});

/**
 * Statics
 */
InstructorSchema.statics = {
	/**
	 * Get instructor
	 * @param {ObjectId} id - The objectId of instructor.
	 * @returns {Promise<Instructor, APIError>}
	 */
	get(id) {
		return this.findById(id)
			.exec()
			.then((instructor) => {
				if (instructor) {
					return instructor;
				}
				const err = new APIError(
					'No such instructor exists!',
					httpStatus.BAD_REQUEST,
					true,
				);
				return Promise.reject(err);
			});
	},
};

/**
 * @typedef Instructor
 */
module.exports = mongoose.model('Instructor', InstructorSchema, 'instructors');
module.exports.InstructorSchema = InstructorSchema;
