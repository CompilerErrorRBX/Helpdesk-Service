const jwt = require('jsonwebtoken');

const config = require('../config');
const db = require('../db/models');

const usersAPI = require('./users');
const rolesAPI = require('./roles');
const authAPI = require('./auth');
const jobsAPI = require('./jobs');
const commentsAPI = require('./comments');

const appRouter = (app) => {

  app.use((req, res, next) => {
    req.query.limit = req.query.limit ? parseInt(req.query.limit) : 10;
    req.query.offset = req.query.offset ? parseInt(req.query.offset) : 0;

    req.authenticated = false;
    req.user = null;

    const token = req.headers.authorization;
    if (!token) {
      return next();
    };

    jwt.verify(token, config.authSecret, (err, decoded) => {
      if (err) {
        return next();
      }

      db.User.find({
        where: { id: decoded.id },
        include: [
          { model: db.Profile, as: 'profile', attributes: { exclude: ['userId', 'id'] } },
          { model: db.Role, as: 'roles', through: { attributes: [] } },
          { model: db.Job, as: 'requests' },
          { model: db.Job, as: 'jobs', through: { attributes: [] } },
        ],
      }).then((user) => {
        if (!user) {
          return next()
        }

        req.authenticated = true;
        req.user = user;
        return next();
      });
    });
  });

  authAPI(app);
  usersAPI(app);
  rolesAPI(app);
  jobsAPI(app);
  commentsAPI(app);
}

module.exports = appRouter;
