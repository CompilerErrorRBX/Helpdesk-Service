const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const config = require('../config');
const db = require('../db/models');
const User = require('../helpers/models/user');
const auth = require('./middleware/authentication');

const AuthAPI = (app) => {
  app.post('/auth/register', (req, res, next) => {
    User.create(req.body)
      .then((user) => {
        const token = jwt.sign({ id: user.id }, config.authSecret, {
          expiresIn: '1d',
        });

        res.status(201).send({ auth: true, token, user });
      }).catch((err) => {
        res.status(400).send({ errors: err.errors.map(error => error.message) });
      });
  });

  app.post('/auth/login', (req, res, next) => {
    db.User.find({
      where: { username: req.body.username },
    }).then((user) => {
      if (!user) {
        res.status(401).send({ auth: false, message: 'Invalid username or password.' });
        return;
      }
      user.getAccount().then((account) => {
        argon2.verify(account.password, req.body.password).then(match => {
          if (match) {
            const token = jwt.sign({ id: user.id }, config.authSecret, {
              expiresIn: '1d',
            });

            res.status(202).send({ auth: true, token, user });
          } else {
            res.status(401).send({ auth: false, message: 'Invalid username or password.' });
          }
        }).catch(err => {
          res.status(500).send('Internal server error');
        });
      });
    });
  });

  app.post('/auth/user', auth.authenticated, (req, res, next) => {
    res.status(200).send(req.user);
  });
}

module.exports = AuthAPI;
