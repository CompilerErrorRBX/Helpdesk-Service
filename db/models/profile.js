module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    biography: DataTypes.TEXT
  }, {});
  Profile.associate = (models) => {
    
  };
  return Profile;
};