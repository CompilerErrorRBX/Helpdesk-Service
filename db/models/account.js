module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 128],
          msg: 'Passwords must be between 8 and 64 characters long.'
        }
      }
    }
  }, {});
  Account.associate = (models) => {
    
  };
  return Account;
};