const db = require('../db/models');

module.exports = function checkPermission(permissionName) {
	return async function (req, res, next) {
		try {
			const userId = req.user?.id;

			if (!userId) {
				return res
					.status(401)
					.json({ message: 'Unauthorized: User not found' });
			}

			const currentUser = await db.user.findByPk(userId, {
				include: {
					model: db.role,
					include: {
						model: db.permission,
						where: { name: permissionName },
					},
				},
			});

			if (!currentUser || !currentUser.roles.length) {
				return res
					.status(403)
					.json({ message: 'Forbidden: No permission' });
			}

			return next();
		} catch (error) {
			console.error('Permission check failed:', error);
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	};
};
