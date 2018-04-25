const db = require('../models');
const User = require('../../helpers/models/user');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return db.Role.create({
      role: 'Technician',
      description: 'Approved site technician',
    });
  },

  down: (queryInterface, Sequelize) => {
    db.Role.destory({
      where: { role: 'Technician' },
    });
  }
};
