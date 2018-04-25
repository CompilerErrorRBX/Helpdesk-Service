const {
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const Pagination = require('../helpers/Pagination');
const schemas = require('../models');
const db = require('../../db/models');

module.exports = {
  name: 'jobs',
  query: {
    type: Pagination.PaginatedList(schemas.Job),
    args: {
      name: { type: GraphQLString },
      title: {
        type: GraphQLString,
        defaultValue: '',
      },
      status: { type: GraphQLString },
      id: { type: GraphQLInt },
      requesterId: { type: GraphQLString },
      ...Pagination.PaginationArgs
    },
    resolve(root, args) {
      args.title = { $like: `%${args.title}%` }
      return Pagination.PaginatedFindAll(db.Job, args);
    },
  },
}
