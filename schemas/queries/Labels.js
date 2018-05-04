const {
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const Pagination = require('../helpers/Pagination');
const schemas = require('../models');
const db = require('../../db/models');

module.exports = {
  name: 'labels',
  query: {
    type: Pagination.PaginatedList(schemas.Label),
    args: {
      jobId: { type: GraphQLInt },
      label: { type: GraphQLString },
      id: { type: GraphQLString },
      ...Pagination.PaginationArgs
    },
    resolve(root, args) {

      const include = [];

      if (args.jobId) {
        const jobId = args.jobId;
        delete args.jobId;

        include.push({ model: db.Job, as: 'jobs', where: { 'id': jobId } });
      }

      const custom = {
        include,
      };

      return Pagination.PaginatedFindAll(db.Label, args, custom);
    },
  },
}
