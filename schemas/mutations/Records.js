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

module.exports = {
  name: 'records',
  mutation: {
    recordCreate: {
      type: schemas.Record,
      args: {
        jobId: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (root, args, req) => {
        const user = Authentication.currentUser(req);

        args.userId = user.id;
        args.description = decodeURI(args.description);

        return db.Job.find({ where: { id: args.jobId } }).then((job) => {
          if (!job) {
            throw new GraphQLError(`Invalid job id: ${args.jobId}`);
          }
          return db.Record.create(args);
        });
      },
    },
  },
}
