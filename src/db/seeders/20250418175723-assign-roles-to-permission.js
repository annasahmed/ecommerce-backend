'use strict';

const db = require('../models');
const permission = db.permission;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const [admin, manager, user] = await Promise.all([
			db.role.findOne({ where: { name: 'admin' } }),
			db.role.findOne({ where: { name: 'manager' } }),
			db.role.findOne({ where: { name: 'user' } }),
		]);

		const allPerms = await permission.findAll();
		await admin.setPermissions(allPerms);

		const managerPerms = await permission.findAll({
			where: {
				name: [
					'view_user',
					'create_user',
					'edit_user',
					'view_role',
					'create_role',
					'edit_role',
				],
			},
		});
		await manager.setPermissions(managerPerms);

		const userPerms = await permission.findAll({
			where: {
				name: ['view_user'],
			},
		});
		await user.setPermissions(userPerms);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('role_to_permission', null, {});
	},
};
