'use strict';
module.exports = (sequelize, DataTypes) => {
  const JobTechnician = sequelize.define('JobTechnician', {
    userId: DataTypes.UUID,
    jobId: DataTypes.BIGINT,
  }, {});
  JobTechnician.associate = (models) => {
    // associations can be defined here
    JobTechnician.belongsTo(models.User, { as: 'technician', foreignKey: 'userId' });
    JobTechnician.belongsTo(models.Job, { as: 'job', foreignKey: 'jobId' });
  };
  return JobTechnician;
};