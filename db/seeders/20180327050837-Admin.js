const db = require('../models');
const User = require('../../helpers/models/user');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return User.create({
      email: 'SiteAdmin@helpdesk.com',
      username: 'Admin',
      firstName: 'Site',
      agreedTOS: true,
      lastName: 'Admin',
      password: 'Admin1234',
    }).then((user) => {
      return db.Role.create({
        role: 'Admin',
        description: 'Site administrator',
      }).then((role) => {
        return user.addRole(role);
      });
    });
  },

  down: (queryInterface, Sequelize) => {

  }
};
