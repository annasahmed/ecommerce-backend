'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('cms_user', [
      {
        first_name: 'Test',
        last_name: "Admin",
        email: 'admin@example.com',
        password: '12345678a',
        role_id: 1,
        created_date_time: new Date(),
        modified_date_time: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('cms_user', null, {});
  }
};
