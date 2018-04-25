const db = require('../db/models');
const auth = require('./middleware/authentication');

const UsersAPI = (app) => {
  app.get('/users', (req, res, next) => {
    req.query.username = req.query.username ? req.query.username : ''
    db.User.findAll({
      where: {
        username: {
          $like: `%${req.query.username}%`
        }
      },
      limit: req.query.limit,
      offset: req.query.offset,
    }).then((result) => {
      res.status(200).send(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error.');
    });
  });

  // Get a list of users in a role
  app.get('/users/role/:role', (req, res, next) => {
    req.query.name = req.query.name ? req.query.name : ''
    db.Role.find({
      where: {
        role: req.params.role,
      },
      include: [
        {
          model: db.User,
          as: 'users',
          through: { attributes: [] },
          include: [
            { model: db.Role, as: 'roles', through: { attributes: [] } },
          ],
          where: {
            username: { $like: `%${req.query.name}%` },
          },
        }
      ],
    }).then((result) => {
      if (!result) {
        return res.status(200).send([]);
      }
      const results = result.users ? result.users : [];
      res.status(200).send(results);
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error.');
    });
  });

  // Gets the currently logged in user.
  app.get('/user', auth.authenticated, (req, res, next) => {
    req.status(200).send(req.user);
  });

  app.get('/user/:user', (req, res, next) => {
    db.User.find({
      where: { 
        $or: [{ id: req.params.user }, { username: req.params.user }]
      },
      include: [
        { model: db.Profile, as: 'profile', attributes: { exclude: ['userId', 'id'] } },
        { model: db.Role, as: 'roles', through: { attributes: [] } },
      ],
    }).then((result) => {
      if (!result) {
        res.status(404).send(`Invalid user: ${req.params.user}`);
        return;
      }
      res.status(200).send(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error.');
    });
  });

  app.patch('/user/:user', (req, res, next) => {
    db.User.find({
      where: {
        $or: [{ id: req.params.user }, { username: req.params.user }]
      },
    }).then((user) => {
      if (!user) {
        res.status(404).send(`Invalid user: ${req.params.user}`);
        return;
      }

      user.update(req.body).then(() => {
        res.status(202).send(user);
      }).catch((err) => {
        res.status(400).send({ errors: err.errors.map(error => error.message) });
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error.');
    });
  });

  app.patch('/user', auth.authenticated, (req, res, next) => {
    req.user.update(req.body).then((user) => {
      res.status(202).send(user);
    }).catch((err) => {
      res.status(400).send({ errors: err.errors.map(error => error.message) });
    });
  });

  app.get('/user/:user/jobs', (req, res, next) => {
    db.User.find({
      where: {
        $or: [{ id: req.params.user }, { username: req.params.user }]
      },
      attributes: [],
      include: [
        { model: db.Job, as: 'jobs', through: { attributes: [] } },
      ],
    }).then((result) => {
      if (!result) {
        res.status(404).send(`Invalid user: ${req.params.user}`);
        return;
      }
      res.status(200).send(result.jobs);
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error.');
    });
  });
  
  app.get('/user/:user/requests', (req, res, next) => {
    db.User.find({
      where: {
        $or: [{ id: req.params.user }, { username: req.params.user }]
      },
      attributes: [],
      include: [
        { model: db.Job, as: 'requests' },
      ],
    }).then((result) => {
      if (!result) {
        res.status(404).send(`Invalid user: ${req.params.user}`);
        return;
      }
      res.status(200).send(result.requests);
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error.');
    });
  });

  app.get('/user/:user/comments', (req, res, next) => {
    db.User.find({
      where: {
        $or: [{ id: req.params.user }, { username: req.params.user }]
      },
      attributes: [],
      include: [
        { model: db.Comment, as: 'comments' },
      ],
    }).then((result) => {
      if (!result) {
        res.status(404).send(`Invalid user: ${req.params.user}`);
        return;
      }

      res.status(200).send(result.comments);
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error.');
    });
  });

  // Only allow users in the Admin role to grant roles.
  app.post('/user/:user/roles/:role', auth.hasRole(['Admin']), (req, res, next) => {
    db.User.find({
      where: { 
        $or: [{ id: req.params.user }, { username: req.params.user }]
       },
    }).then((user) => {
      if (!user) {
        res.status(404).send(`Invalid user: ${req.params.user}`);
        return;
      }
      db.Role.find({
        where: { 
          $or: [{ id: req.params.role }, { role: req.params.role }]
         },
      })
      .then((role) => {
        if (!role) {
          res.status(404).send(`Invalid role: ${req.params.role}`);
          return;
        }

        user.addRole(role);
        res.status(202).send('Success');
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error.');
    });
  });

  // Only allow users in the Admin role to grant roles.
  app.delete('/user/:user/roles/:role', auth.hasRole(['Admin']), (req, res, next) => {
    db.User.find({
      where: {
        $or: [{ id: req.params.user }, { username: req.params.user }]
      },
    }).then((user) => {
      if (!user) {
        res.status(404).send(`Invalid user: ${req.params.user}`);
        return;
      }
      db.Role.find({
        where: {
          $or: [{ id: req.params.role }, { role: req.params.role }]
        },
      })
        .then((role) => {
          if (!role) {
            res.status(404).send(`Invalid role: ${req.params.role}`);
            return;
          }

          user.removeRole(role);
          res.status(202).send('Success');
        });
    }).catch((err) => {
      console.log(err);
      res.status(500).send('Internal Server Error.');
    });
  });
}

module.exports = UsersAPI;
