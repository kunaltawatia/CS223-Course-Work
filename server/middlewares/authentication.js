const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const User = require('../auth/auth.model');

async function authenticate(req, res, next) {
	try {
		var token;

		/**
		 * Safely extract token id from Authorization header.
		 */
		if (req.headers && req.headers.authorization) {
			var parts = req.headers.authorization.split(' ');
			if (parts.length == 2) {
				var scheme = parts[0];
				var credentials = parts[1];

				if (/^Bearer$/i.test(scheme)) {
					token = credentials;
				} else {
					throw new APIError(
						'Authentication error: Bad Scheme',
						httpStatus.UNAUTHORIZED,
						true,
					);
				}
			} else {
				throw new APIError(
					'Authentication error: Bad Format',
					httpStatus.UNAUTHORIZED,
					true,
				);
			}
		} else {
			//	ToDo: cookie token
			throw new APIError(
				'Authorization Header Missing',
				httpStatus.UNAUTHORIZED,
				true,
			);
		}

		//	search and load user, corresponding to the token from db
		const user = await User.findOne({ token });

		if (user) {
			req.user = user;
			return next();
		} else {
			throw new APIError(
				'Token is unauthorized',
				httpStatus.UNAUTHORIZED,
				true,
			);
		}
	} catch (err) {
		return next(err);
	}
}

module.exports = authenticate;
