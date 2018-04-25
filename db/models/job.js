module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    requesterId: {
      type: DataTypes.UUID
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Closed', 'Resolved', 'In Progress')
    },
    bounty: {
      type: DataTypes.STRING
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING(128)
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
  }, {
    paranoid: true,
    hooks: {
      beforeCreate(model) {
        const name = model.title.replace(/ /g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase();
        model.name = name;
      }
    }
  });
  Job.associate = (models) => {
    Job.belongsToMany(models.User, { through: 'JobTechnician', as: 'technicians', foreignKey: 'jobId', targetKey: 'id' });
    Job.belongsTo(models.User, { as: 'requester', foreignKey: 'requesterId', targetKey: 'id' });
    Job.hasMany(models.Comment, { as: 'comments', foreignKey: 'jobId', onDelete: 'cascade' })
  };
  return Job;
};