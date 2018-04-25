const {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLError,
} = require('graphql');

const schemas = require('../models');
const UserHelper = require('../../helpers/models/user');
const Authentication = require('../helpers/Authentication');
const db = require('../../db/models');

module.exports = {
  name: 'users',
  mutation: {
    userCreate: {
      type: schemas.User,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        picture: { type: GraphQLString },
      },
      resolve: (root, args) => {
        return UserHelper.create(args);
      },
    },
    userUpdate: {
      type: schemas.User,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        agreedTOS: { type: GraphQLBoolean },
        phone: { type: GraphQLString },
        picture: { type: GraphQLString },
      },
      resolve: (root, args, req) => {
        const user = Authentication.currentUser(req);
        return user.update(args);
      },
    },
    userAddRole: {
      type: schemas.User,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (root, args, req) => {
        if (!Authentication.hasRole(req, 'Admin')) {
          throw new GraphQLError('Unauthorized.');
        }

        return db.User.find({ where: { id: args.userId } }).then((user) => {
          if (!user) {
            throw new GraphQLError(`Invalid user id: ${args.userId}`);
          }

          return db.Role.find({ where: { role: args.role } }).then((role) => {
            if (!role) {
              throw new GraphQLError(`Invalid role: ${args.role}`);
            }

            return user.addRole(role);;
          });
        });
      },
    },
    userRemoveRole: {
      type: schemas.User,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (root, args, req) => {
        if (!Authentication.hasRole(req, 'Admin') || args.role === 'Admin') {
          throw new GraphQLError('Unauthorized.');
        }

        return db.User.find({ where: { id: args.userId } }).then((user) => {
          if (!user) {
            throw new GraphQLError(`Invalid user id: ${args.userId}`);
          }

          return db.Role.find({ where: { role: args.role } }).then((role) => {
            if (!role) {
              throw new GraphQLError(`Invalid role: ${args.role}`);
            }

            return user.removeRole(role);;
          });
        });
      },
    },
  },
}
