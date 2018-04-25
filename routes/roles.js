const db = require('../db/models');
const auth = require('./middleware/authentication');

const RolesAPI = (app) => {
  app.get('/roles', (req, res, next) => {
    db.Role.findAll().then((result) => {
      res.status(200).send(result);
    }).catch((err) => {
      res.status(500).send(err);
    });
  });

  app.get('/role/:role', (req, res, next) => {
    db.Role.find({
      where: { 
        $or: [{ id: req.params.role }, { role: req.params.role }]
      }
    }).then((result) => {
      if (!result) {
        res.status(404).send('No results found.');
        return;
      }
      res.status(200).send(result);
    }).catch((err) => {
      res.status(500).send(err);
    });
  });

  app.post('/roles', auth.hasRole(['Admin']), (req, res, next) => {
    db.Role.create(req.body)
      .then((role) => {
        res.status(201).send(role);
      }).catch((err) => {
        res.status(400).send({ errors: err.errors.map(error => error.message) });
      });
  });

  app.delete('/role/:role', auth.hasRole(['Admin']), (req, res, next) => {
    db.Role.create(req.body)
      .then((role) => {
        res.status(201).send(role);
      }).catch((err) => {
        res.status(400).send({ errors: err.errors.map(error => error.message) });
      });
  });
}

module.exports = RolesAPI;
