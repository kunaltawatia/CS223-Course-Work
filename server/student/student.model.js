const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * Student Schema
 */
const StudentSchema = new mongoose.Schema({
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
	rollNumber: {
		type: String,
		required: true,
	},
});

/**
 * Statics
 */
StudentSchema.statics = {
	/**
	 * Get student
	 * @param {ObjectId} id - The objectId of student.
	 * @returns {Promise<Student, APIError>}
	 */
	get(id) {
		return this.findById(id)
			.exec()
			.then((student) => {
				if (student) {
					return student;
				}
				const err = new APIError(
					'No such student exists!',
					httpStatus.BAD_REQUEST,
					true,
				);
				return Promise.reject(err);
			});
	},
};

/**
 * @typedef Student
 */
module.exports = mongoose.model('Student', StudentSchema, 'students');
module.exports.StudentSchema = StudentSchema;
