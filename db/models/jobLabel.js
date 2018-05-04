'use strict';
module.exports = (sequelize, DataTypes) => {
  const JobLabel = sequelize.define('JobLabel', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
    },
    label: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    jobId: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
  }, {});
  JobLabel.associate = (models) => {

  };
  return JobLabel;
};