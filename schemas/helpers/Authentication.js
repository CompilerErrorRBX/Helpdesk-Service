const { GraphQLError } = require('graphql');

const Authentication = {};

Authentication.requireLogin = (req) => {
  if (!req.authenticated) {
    throw new GraphQLError('Unauthenticated.');
  }
}

Authentication.currentUser = (req) => {
  Authentication.requireLogin(req);
  return req.user;
}

Authentication.hasRole = (req, ...roleList) => {
  const user = Authentication.currentUser(req);

  let hasRole = false;

  user.roles.forEach(role => {
    if (roleList.indexOf(role.role) > -1) {
      hasRole = true;
    }
  });

  if (hasRole) {
    return true;
  }

  throw new GraphQLError('Unauthorized.');
}

module.exports = Authentication;
