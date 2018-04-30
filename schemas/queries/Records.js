const {
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const Pagination = require('../helpers/Pagination');
const schemas = require('../models');
const db = require('../../db/models');

module.exports = {
  name: 'records',
  query: {
    type: Pagination.PaginatedList(schemas.Record),
    args: {
      userId: { type: GraphQLString },
      jobId: { type: GraphQLInt },
      ...Pagination.PaginationArgs
    },
    resolve(root, args) {
      return Pagination.PaginatedFindAll(db.Record, args);
    },
  },
}
