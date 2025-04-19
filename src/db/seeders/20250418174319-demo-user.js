'use strict';

const { encryptData } = require('../../utils/auth');
const db = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const admin = await db.role.findOne({ where: { name: 'admin' } });
		const hashedPassword = await encryptData('12345678a');
		return queryInterface.bulkInsert('user', [
			{
				first_name: 'Test',
				last_name: 'Admin',
				email: 'admin@example.com',
				password: hashedPassword,
				role_id: admin.id,
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('user', null, {});
	},
};
