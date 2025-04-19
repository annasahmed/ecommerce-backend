const db = require('../db/models');

module.exports = async function setUserMiddleware(req, res, next) {
	if (!req.user || !req.user.id) {
		return next();
	}

	try {
		const user = await db.user.findByPk(req.user.id, {
			include: {
				model: db.role,
				include: db.permission,
			},
		});

		if (!user) {
			return res
				.status(401)
				.json({ message: 'Unauthorized: User not found' });
		}

		req.user = user; // Replaces token payload with full user object
		next();
	} catch (err) {
		console.error('Error in setUserMiddleware:', err);
		res.status(500).json({ message: 'Internal server error' });
	}
};
