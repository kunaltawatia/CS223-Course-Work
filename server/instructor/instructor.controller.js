const Instructor = require('./instructor.model');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
	Instructor.get(id)
		.then((profile) => {
			req.profile = profile; // eslint-disable-line no-param-reassign
			return next();
		})
		.catch((e) => next(e));
}

/**
 * Get profile
 * @returns {Profile}
 */
function get(req, res) {
	res.json({
		profile: req.profile,
	});
}

module.exports = {
	load,
	get,
};
