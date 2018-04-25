'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    userId: DataTypes.UUID,
    role: DataTypes.STRING
  }, {});
  UserRole.associate = (models) => {
    // associations can be defined here
  };
  return UserRole;
};