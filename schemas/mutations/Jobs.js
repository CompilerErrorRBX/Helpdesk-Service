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
  name: 'users',
  mutation: {
    jobCreate: {
      type: schemas.Job,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        bounty: { type: GraphQLString },
      },
      resolve: (root, args, req) => {
        const user = Authentication.currentUser(req);
        args.requesterId = user.id;
        return db.Job.create(args);
      },
    },
    jobUpdate: {
      type: schemas.Job,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
      },
      resolve: (root, args, req) => {
        if (args.description) {
          args.description = decodeURI(args.description);
        }

        const user = Authentication.currentUser(req);
        return db.Job.find({ where: { id: args.id } }).then((job) => {
          if (!job) {
            throw new GraphQLError(`Invalid job id: ${args.id}`);
          }
          if (job.requesterId !== user.id && !Authentication.hasRole(req, 'Admin', 'Technician')) {
            throw new GraphQLError('Unauthorized.');
          }

          return job.update(args);
        });
      },
    },
    jobCommentCreate: {
      type: schemas.Comment,
      args: {
        jobId: { type: new GraphQLNonNull(GraphQLInt) },
        body: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (root, args, req) => {
        const user = Authentication.currentUser(req);
        args.commenterId = user.id;

        return db.Job.find({ where: { id: args.jobId } }).then((job) => {
          if (!job) {
            throw new GraphQLError(`Invalid job id: ${args.jobId}`);
          }
          if (job.requesterId !== user.id && !Authentication.hasRole(req, 'Technician', 'Admin')) {
            throw new GraphQLError('Unauthorized.');
          }

          return db.Comment.create(args);
        });
      },
    },
    jobTechnicianAdd: {
      type: schemas.User,
      args: {
        jobId: { type: new GraphQLNonNull(GraphQLInt) },
        technicianId: { type: GraphQLString },
      },
      resolve: (root, args, req) => {
        const requiredRoles = ['Admin', 'Technician'];
        const roles = args.technicianId ? ['Admin'] : ['Technician', 'Admin'];
        if (!Authentication.hasRole(req, ...roles)) {
          throw new GraphQLError('Unauthorized.');
        }

        return db.Job.find({ where: { id: args.jobId } }).then((job) => {
          if (!job) {
            throw new GraphQLError(`Invalid job id: ${args.jobId}`);
          }

          if (args.technicianId) {
            return db.User.find({
              where: { id: args.technicianId },
              include: [{ model: db.Role, as: 'roles', where: { 'role': { $in: requiredRoles } } } ]
            }).then((user) => {
              if (!user) {
                throw new GraphQLError(`Invalid technician id: ${args.technician}`);
              }

              return job.addTechnician(user);
            });
          }

          const user = Authentication.currentUser(req);
          return job.addTechnician(user);
        });
      },
    },
    jobLabelsAdd: {
      type: schemas.Job,
      args: {
        jobId: { type: new GraphQLNonNull(GraphQLInt) },
        labels: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (root, args, req) => {
        const user = Authentication.currentUser(req);

        args.userId = user.id;
        const labels = decodeURI(args.labels).split(',');

        return db.Job.find({ where: { id: args.jobId } }).then((job) => {
          if (!job) {
            throw new GraphQLError(`Invalid job id: ${args.jobId}`);
          }
          if (job.requesterId !== user.id && !Authentication.hasRole(req, 'Admin', 'Technician')) {
            throw new GraphQLError('Unauthorized.');
          }

          labels.forEach((label) => {
            db.Label.findOrCreate({
              where: { label },
              defaults: { label },
            }).then((labelModel) => {
              job.addLabel(labelModel);
            });
          });

          return job;
        });
      },
    },
    jobLabelRemove: {
      type: schemas.Label,
      args: {
        jobId: { type: new GraphQLNonNull(GraphQLInt) },
        label: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (root, args, req) => {
        const user = Authentication.currentUser(req);

        args.userId = user.id;
        args.label = decodeURI(args.label);

        return db.Job.find({ where: { id: args.jobId } }).then((job) => {
          if (!job) {
            throw new GraphQLError(`Invalid job id: ${args.jobId}`);
          }
          if (job.requesterId !== user.id && !Authentication.hasRole(req, 'Admin', 'Technician')) {
            throw new GraphQLError('Unauthorized.');
          }

          return db.Label.find({
            where: { label: args.label },
          }).then((label) => {
            if (!label) {
              throw new GraphQLError(`Invalid label: ${args.label}`);
            }

            job.removeLabel(label);
          });
        });
      },
    },
  },
}
