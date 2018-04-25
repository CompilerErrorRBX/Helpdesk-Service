const authHelpers = {
  hasRole(roleList) {
    return ((req, res, next) => {
      if (!req.authenticated) {
        return res.status(401).send('Invalid Authorization Token.');
      }

      let hasRole = false;
      
      req.user.roles.forEach(role => {
        if (roleList.indexOf(role.role) > -1) {
          hasRole = true;
          return;
        }
      });
      // User is not an admin and should not gain access.
      if (!hasRole) {
        return res.status(403).send('Unauthorized.');
      }
      next();
    });
  },

  authenticated(req, res, next) {
    if (!req.authenticated) {
      return res.status(401).send('Invalid Authorization Token.');
    }
    next();
  },
};

module.exports = authHelpers;
