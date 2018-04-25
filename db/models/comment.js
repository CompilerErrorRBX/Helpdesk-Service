'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    body: {
      allowNull: false,
      type: DataTypes.STRING(512)
    },
  }, {
    paranoid: true
  });
  Comment.associate = (models) => {
    Comment.hasMany(models.Comment, { as: 'replies', foreignKey: 'replyId', onDelete: 'CASCADE', hooks: true });
    Comment.belongsTo(models.Comment, { as: 'replyTo', foreignKey: 'replyId' });
    Comment.belongsTo(models.User, { as: 'commenter', foreignKey: 'commenterId' });
    Comment.belongsTo(models.Job, { as: 'job', foreignKey: 'jobId', targetKey: 'id' });
  };
  return Comment;
};