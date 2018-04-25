const {
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const Pagination = require('../helpers/Pagination');
const schemas = require('../models');
const db = require('../../db/models');

module.exports = {
  name: 'comments',
  query: {
    type: Pagination.PaginatedList(schemas.Comment),
    args: {
      commenterId: { type: GraphQLString },
      jobId: { type: GraphQLInt },
      replyId: { type: GraphQLString },
      id: { type: GraphQLString },
      ...Pagination.PaginationArgs
    },
    resolve(root, args) {
      return Pagination.PaginatedFindAll(db.Comment, args);
    },
  },
}
