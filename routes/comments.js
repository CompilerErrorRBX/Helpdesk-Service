const db = require('../db/models');
const auth = require('./middleware/authentication');

const RolesAPI = (app) => {
  app.get('/comment/:id', (req, res, next) => {
    db.Comment.find({
      where: {
        id: req.params.id,
      },
      include: [
        { model: db.Comment, as: 'replies' }
      ]
    }).then((comment) => {
      if (!comment) {
        return res.status(404).send(`Invalid comment id: ${req.params.id}`);
      }
      res.status(200).send(comment);
    }).catch(() => res.status(500).send('Internal server error.'));
  });

  app.patch('/comment/:id', auth.authenticated, (req, res, next) => {
    db.Comment.find({
      where: {
        id: req.params.id,
      },
    }).then((comment) => {
      if (!comment) {
        return res.status(404).send(`Invalid comment id: ${req.params.id}`);
      }
      if (comment.commenterId !== req.user.id) {
        return res.status(403).send(`Unauthorized.`);
      }

      comment.update(req.body).then(() => {
        res.status(202).send(comment);
      }).catch((err) => {
        res.status(400).send({ errors: err.errors.map(error => error.message) });
      });
    }).catch(() => res.status(500).send('Internal server error.'));
  });

  app.delete('/comment/:id', auth.authenticated, (req, res, next) => {
    db.Comment.find({
      where: {
        id: req.params.id,
      },
    }).then((comment) => {
      if (!comment) {
        return res.status(404).send(`Invalid comment id: ${req.params.id}`);
      }
      if (comment.commenterId !== req.user.id) {
        return res.status(403).send(`Unauthorized.`);
      }

      comment.destroy().then(() => {
        res.status(202).send(comment);
      });
    }).catch(() => res.status(500).send('Internal server error.'));
  });

  app.post('/comment/:id/reply', auth.authenticated, (req, res, next) => {
    db.Comment.find({
      where: {
        id: req.params.id,
      }
    }).then((comment) => {
      if (!comment) {
        return res.status(404).send(`Invalid comment id: ${req.params.id}`);
      }
      
      const commentObj = req.body;
      commentObj.commenterId = req.user.id;
      commentObj.replyId = comment.id;

      db.Comment.create(commentObj).then((reply) => {
        res.status(201).send(reply);
      }).catch((err) => {
        res.status(400).send({ errors: err.errors.map(error => error.message) });
      });
    }).catch(() => res.status(500).send('Internal server error.'));
  });
}

module.exports = RolesAPI;
