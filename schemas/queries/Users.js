const {
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const Pagination = require('../helpers/Pagination');
const schemas = require('../models');
const db = require('../../db/models');

module.exports = {
  name: 'users',
  query: {
    type: Pagination.PaginatedList(schemas.User),
    args: {
      username: {
        type: GraphQLString,
        defaultValue: '',
      },
      role: { type: GraphQLString },
      id: { type: GraphQLString },
      jobId: { type: GraphQLInt },
      query: { type: GraphQLString },
      ...Pagination.PaginationArgs
    },
    resolve(root, args, context) {
      args.username = { $like: `%${args.username}%` }

      if (args.query) {
        const query = args.query;
        args['$or'] = [
          { 'username': { $like: `%${query}%` } },
          { 'firstName': { $like: `%${query}%` } },
          { 'lastName': { $like: `%${query}%` } },
          { 'email': { $like: `%${query}%` } },
        ]
      }

      delete args.query;

      const include = [];

      if (args.role) {
        const roles = args.role.split(',');
        delete args.role;

        include.push({ model: db.Role, as: 'roles', where: { 'role': { $in: roles } } });
      }

      if (args.jobId) {
        const jobId = args.jobId;
        delete args.jobId;

        include.push({ model: db.Job, as: 'jobs', where: { 'id': jobId } });
      }

      const custom = {
        include,
      };

      return Pagination.PaginatedFindAll(db.User, args, custom);
    },
  },
}
