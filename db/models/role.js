module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING
  }, {});
  Role.associate = (models) => {
    Role.belongsToMany(models.User, { through: 'UserRole', as: 'users', foreignKey: 'role', targetKey: 'role' });
  };
  return Role;
};
