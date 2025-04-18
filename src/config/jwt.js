const expressJwt = require('express-jwt');
const config = require('./config.js');
const catchAsync = require('../utils/catchAsync.js');
const db = require('../db/models/index.js');
const { tokenTypes } = require('./tokens.js');

async function isRevoked(_req, _payload, done) {
	catchAsync(
		async () => {
			const token = _req.headers.authorization?.split(' ')[1];
			if (!token) return done(null, true); // no token? revoke

			// Check if it's a refresh token based on route or other logic
			const isRefreshRoute = _req.originalUrl.includes('/refresh-token'); // or use custom header/param

			if (!isRefreshRoute) {
				// assume it's an access token, and not string access token in db
				return done(null, false); // valid if not expired
			}

			// Only check DB for refresh token revocation
			const savedToken = await db.token.findOne({
				where: {
					token,
					type: tokenTypes.REFRESH,
					revoked: false,
				},
			});

			if (!savedToken) return done(null, true); // revoked

			return done(null, false); // token is good
		}
	)
	done();
}

function jwt() {
	const { secret } = config.jwt;
	return expressJwt({
		secret,
		getToken: function fromHeaderOrQuerystring(req) {
			const token = req.headers.authorization.split(' ')[1]
			if (token) return token;
			return null;
		},
		algorithms: ['HS256'],
		isRevoked,
	}).unless({
		path: [
			// public routes that don't require authentication
			/\/v[1-9](\d)*\/(auth|docs)\/.*/,
		],
	}).on('error', (err, req, res, next) => {
		// Customize error response
		res.status(401).json({ message: 'Unauthorized access', error: err.message });
	});
}

module.exports = jwt;
