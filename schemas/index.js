const { 
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
} = require('graphql');

const queries = require('./queries');
const mutations = require('./mutations');

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Helpdesk API Root',
  fields: () => queries,
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Helpdesk API Root',
  fields: () => mutations,
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

module.exports = Schema;
