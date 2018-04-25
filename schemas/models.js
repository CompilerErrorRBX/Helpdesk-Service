const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
} = require('graphql');

const User = new GraphQLObjectType({
  name: 'User',
  description: 'User representation',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: user => user.id,
    },
    firstName: {
      type: GraphQLString,
      resolve: user => user.firstName,
    },
    lastName: {
      type: GraphQLString,
      resolve: user => user.lastName,
    },
    email: {
      type: GraphQLString,
      resolve: user => user.email,
    },
    username: {
      type: GraphQLString,
      resolve: user => user.username,
    },
    picture: {
      type: GraphQLString,
      resolve: user => user.picture,
    },
    phone: {
      type: GraphQLString,
      resolve: user => user.phone,
    },
    agreedTOS: {
      type: GraphQLBoolean,
      resolve: user => user.agreedTOS,
    },
    createdAt: {
      type: GraphQLString,
      resolve: job => job.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: job => job.updatedAt,
    },
    jobs: {
      type: new GraphQLList(Job),
      resolve: user => user.getJobs({ order: [['createdAt', 'DESC']] }),
    },
    requests: {
      type: new GraphQLList(Job),
      resolve: user => user.getRequests({ order: [['createdAt', 'DESC']] }),
    },
    comments: {
      type: new GraphQLList(Comment),
      resolve: user => user.getComments({ order: [['createdAt', 'DESC']] }),
    },
    roles: {
      type: new GraphQLList(Role),
      resolve: user => user.getRoles({ order: [['role', 'DESC']] }),
    },
    profile: {
      type: Profile,
      resolve: user => user.getProfile(),
    },
  })
});

const Job = new GraphQLObjectType({
  name: 'Job',
  description: 'Job representation',
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: job => job.id,
    },
    name: {
      type: GraphQLString,
      resolve: job => job.name,
    },
    title: {
      type: GraphQLString,
      resolve: job => job.title,
    },
    description: {
      type: GraphQLString,
      resolve: job => job.description,
    },
    status: {
      type: GraphQLString,
      resolve: job => job.status,
    },
    bounty: {
      type: GraphQLString,
      resolve: job => job.bounty,
    },
    createdAt: {
      type: GraphQLString,
      resolve: job => job.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: job => job.updatedAt,
    },
    requester: {
      type: User,
      resolve: job => job.getRequester({ order: [['createdAt', 'DESC']] }),
    },
    technicians: {
      type: new GraphQLList(User),
      resolve: job => job.getTechnicians({ order: [['username', 'DESC']] }),
    },
    comments: {
      type: new GraphQLList(Comment),
      resolve: job => job.getComments({ order: [['createdAt', 'DESC']] }),
    },
  }),
});

const Role = new GraphQLObjectType({
  name: 'Role',
  description: 'Role representation',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: role => role.id,
    },
    role: {
      type: GraphQLString,
      resolve: role => role.role,
    },
    createdAt: {
      type: GraphQLString,
      resolve: role => role.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: role => role.updatedAt,
    },
    users: {
      type: new GraphQLList(User),
      resolve: role => role.getUsers({ order: [['username', 'DESC']] }),
    },
  }),
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'Comment representation',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: comment => comment.id,
    },
    body: {
      type: GraphQLString,
      resolve: comment => comment.body,
    },
    commenterId: {
      type: GraphQLString,
      resolve: comment => comment.commenterId,
    },
    createdAt: {
      type: GraphQLString,
      resolve: comment => comment.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: comment => comment.updatedAt,
    },
    commenter: {
      type: User,
      resolve: comment => comment.getCommenter(),
    },
    replies: {
      type: new GraphQLList(Comment),
      resolve: comment => comment.getReplies({ order: [['createdAt', 'DESC']] }),
    },
    job: {
      type: Job,
      resolve: comment => comment.getJob(),
    },
    replyTo: {
      type: Comment,
      resolve: comment => comment.getReplyTo(),
    },
  }),
});

const Profile = new GraphQLObjectType({
  name: 'Profile',
  description: 'Profile representation',
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: profile => profile.id,
    },
    userId: {
      type: GraphQLString,
      resolve: profile => profile.userId,
    },
    biography: {
      type: GraphQLString,
      resolve: profile => profile.biography,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: profile => profile.updatedAt,
    },
  }),
});

module.exports = {
  User,
  Job,
  Role,
  Comment
};
