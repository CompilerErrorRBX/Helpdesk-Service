'use strict';
module.exports = (sequelize, DataTypes) => {
  const Label = sequelize.define('Label', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
    },
    label: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 32],
          msg: 'Labels must be between 3 and 32 characters long.'
        }
      },
    },
  }, {});
  Label.associate = (models) => {
    Label.belongsToMany(models.Job, { through: 'JobLabel', as: 'jobs', foreignKey: 'label', targetKey: 'label' });
  };
  return Label;
};