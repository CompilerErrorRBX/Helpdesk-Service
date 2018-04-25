const {
  GraphQLString,
} = require('graphql');

const Pagination = require('../helpers/Pagination');
const schemas = require('../models');
const db = require('../../db/models');

module.exports = {
  name: 'roles',
  query: {
    type: Pagination.PaginatedList(schemas.Role),
    args: {
      role: { type: GraphQLString },
      id: { type: GraphQLString },
      ...Pagination.PaginationArgs
    },
    resolve(root, args) {
      return Pagination.PaginatedFindAll(db.Role, args);
    },
  },
}
