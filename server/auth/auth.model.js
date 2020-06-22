const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
		select: false,
	},
	databaseId: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: 'student',
		enum: ['student', 'instructor'],
	},
});

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema, 'users');
