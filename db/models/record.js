'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    jobId: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    description: {
      type: DataTypes.STRING,
    },
  }, {
    paranoid: true,
  });
  Record.associate = (models) => {
    Record.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };
  return Record;
};