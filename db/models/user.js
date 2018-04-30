module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING(32),
      unique: true,
      validate: {
        len: {
          args: [3, 32],
          msg: 'Usernames must be between 3 and 32 characters long.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Invalid email format.'
        }
      }
    },
    picture: DataTypes.STRING,
    agreedTOS: DataTypes.BOOLEAN,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
  }, {
    paranoid: true,
    hooks: {
      beforeCreate(model, options) {
        sequelize.models.Profile.create({
          userId: model.id
        });
      }
    }
  });
  User.associate = (models) => {
    User.belongsTo(models.Account, { as: 'account', foreignKey: 'accountId' })
    User.belongsToMany(models.Role, { through: 'UserRole', as: 'roles', foreignKey: 'userId' });
    User.hasOne(models.Profile, { as: 'profile', foreignKey: 'userId' });
    User.hasMany(models.Job, { as: 'requests', foreignKey: 'requesterId', targetKey: 'id' });
    User.hasMany(models.Comment, { as: 'comments', foreignKey: 'commenterId', targetKey: 'id' });
    User.hasMany(models.Record, { as: 'records', foreignKey: 'userId', targetKey: 'id' });
    User.belongsToMany(models.Job, { through: 'JobTechnician', as: 'jobs', foreignKey: 'userId', targetKey: 'id' });
  };
  return User;
};
