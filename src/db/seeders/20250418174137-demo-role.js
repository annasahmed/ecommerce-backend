'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('role', [
      {
        name: 'admin',
        description: 'admin role has complete access',
      },
      {
        name: 'manager',
        description: 'manager role connot delete records',
      },
      {
        name: 'user',
        description: 'user role can only view',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('role', null, {});
  }
};
