const {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLError,
} = require('graphql');

const schemas = require('../models');
const Authentication = require('../helpers/Authentication');
const db = require('../../db/models');
// test
module.exports = {
  name: 'comments',
  mutation: {
    commentUpdate: {
      type: schemas.Comment,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (root, args, req) => {
        const user = Authentication.currentUser(req);

        return db.Comment.find({ where: { id: args.id } }).then((comment) => {
          if (!comment) {
            throw new GraphQLError(`Invalid comment id: ${args.id}`);
          }
          if (comment.commenterId !== user.id && !Authentication.hasRole(req, 'Admin')) {
            throw new GraphQLError('Unauthorized.');
          }

          return comment.update(args);
        });
      },
    },
    commentDestroy: {
      type: schemas.Comment,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (root, args, req) => {
        const user = Authentication.currentUser(req);

        return db.Comment.find({ where: { id: args.id } }).then((comment) => {
          if (!comment) {
            throw new GraphQLError(`Invalid comment id: ${args.id}`);
          }
          if (comment.commenterId !== user.id && !Authentication.hasRole(req, 'Admin')) {
            throw new GraphQLError('Unauthorized.');
          }

          return comment.destroy();
        });
      },
    },
    commentReply: {
      type: schemas.Comment,
      args: {
        replyId: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (root, args, req) => {
        const user = Authentication.currentUser(req);
        args.commenterId = user.id;
        args.body = decodeURI(args.body);

        return db.Comment.find({ where: { id: args.replyId } }).then((comment) => {
          if (!comment) {
            throw new GraphQLError(`Invalid reply comment id: ${args.replyId}`);
          }
          if (comment.commenterId !== user.id && !Authentication.hasRole(req, 'Admin')) {
            throw new GraphQLError('Unauthorized.');
          }

          return db.Comment.create(args);
        });
      },
    },
  },
}
