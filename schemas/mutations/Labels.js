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
  name: 'labels',
  mutation: {

  },
}
