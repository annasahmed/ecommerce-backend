'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const defaultPermissions = [
      { name: 'view_user', description: 'Can view users', parent: 'user' },
      { name: 'create_user', description: 'Can create users', parent: 'user' },
      { name: 'edit_user', description: 'Can edit users', parent: 'user' },
      { name: 'delete_user', description: 'Can delete users', parent: 'user' },
      { name: 'view_role', description: 'Can view roles', parent: 'role' },
      { name: 'create_role', description: 'Can create roles', parent: 'role' },
      { name: 'edit_role', description: 'Can edit roles', parent: 'role' },
      { name: 'delete_role', description: 'Can delete roles', parent: 'role' },
    ];

    console.log('✅ Permissions seeded');

    return queryInterface.bulkInsert('permission', defaultPermissions);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('permission', null, {});
  }
};
