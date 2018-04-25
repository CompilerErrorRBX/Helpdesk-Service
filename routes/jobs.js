const db = require('../db/models');
const auth = require('./middleware/authentication');

const RolesAPI = (app) => {
  // Get all jobs
  app.get('/jobs', (req, res, next) => {
    db.Job.findAll({
      limit: req.query.limit,
      offset: req.query.offset,
      include: [
        {
          model: db.User,
          as: 'requester',
          include: [{ model: db.Role, as: 'roles', through: { attributes: [] } }],
        },
      ]
    }).then((result) => {
      res.status(200).send(result);
    }).catch(() => res.status(500).send('Internal server error.'));
  });

  // Get a job by id or name
  app.get('/job/:job', (req, res, next) => {
    db.Job.find({
      where: { 
        $or: [{ id: req.params.job }, { name: req.params.job }]
       },
      include: [
        { model: db.User, as: 'requester' },
        { model: db.Comment, as: 'comments', attributes: ['id'] },
        { model: db.User, as: 'technicians' },
      ]
    }).then((job) => {
      if (!job) {
        return res.status(404).send(`Invalid job: ${req.params.job}`);
      }

      res.status(200).send(job);
    }).catch(() => res.status(500).send('Internal server error.'));
  });

  // Get a job by id or name
  app.get('/jobs/:jobId/:jobName', (req, res, next) => {
    db.Job.find({
      where: {
        $and: [{ id: req.params.jobId }, { name: req.params.jobName }]
      },
      include: [
        { model: db.User, as: 'requester' },
      ]
    }).then((job) => {
      if (!job) {
        return res.status(404).send(`Invalid job: ${req.params.jobId}/${req.params.jobName}`);
      }

      res.status(200).send(job);
    }).catch(() => res.status(500).send('Internal server error.'));
  });

  // Get a job by id or name's comments
  app.get('/job/:job/comments', (req, res, next) => {
    db.Comment.findAndCountAll({
      where: {
        jobId: req.params.job,
      },
      limit: req.query.limit,
      offset: req.query.offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.User,
          as: 'commenter',
          include: [{ model: db.Role, as: 'roles', through: { attributes: [] } }],
        },
      ],
    }).then((comments) => {
      res.status(200).send({
        totalResults: comments.count,
        items: comments.rows,
        moreResults: req.query.offset + req.query.limit < comments.count,
      });
    }).catch(() => res.status(500).send('Internal server error.'));
  });

  // Get a job by id or name's technicians
  app.get('/job/:job/technicians', (req, res, next) => {
    db.Job.find({
      where: {
        $or: [{ id: req.params.job }, { name: req.params.job }],
      },
      include: [
        { model: db.User, as: 'technicians', through: { attributes: [] }, order: [['createdAt', 'DESC']] },
      ]
    }).then((job) => {
      if (!job) {
        return res.status(404).send(`Invalid job: ${req.params.job}`);
      }

      res.status(200).send(job.technicians);
      }).catch(() => res.status(500).send('Internal server error.'));
  });

  // Create a new job
  app.post('/jobs', auth.authenticated, (req, res, next) => {
    req.body.requesterId = req.user.id;
    db.Job.create(req.body)
      .then((job) => {
        res.status(201).send(job);
      })
      .catch((err) => {
        res.status(400).send({ errors: err.errors.map(error => error.message) });
      });
  });

  // Update a job by id or name
  app.patch('/job/:job', (req, res, next) => {
    db.Job.find({
      where: {
        $or: [{ id: req.params.job }, { name: req.params.job }]
      }
    }).then((job) => {
      if (!job) {
        return res.status(404).send(`Invalid job: ${req.params.job}`);
      }

      job.update(req.body).then(() => {
        res.status(202).send(job);
      }).catch((err) => {
        res.status(400).send({ errors: err.errors.map(error => error.message) });
      });
    }).catch(() => res.status(500).send('Internal server error.'));
  });

  // Add a comment to a job
  app.post('/job/:job/comment', auth.authenticated, (req, res, next) => {
    db.Job.find({
      where: {
        id: req.params.job,
      },
    }).then((job) => {
      if (!job) {
        return res.status(404).send(`Invalid job: ${req.params.job}`);
      }

      const commentObj = req.body;
      commentObj.commenterId = req.user.id;
      commentObj.jobId = job.id;

      if (commentObj.body === '') {
        return res.status(400).send('Body cannont be blank');
      }

      db.Comment.create(commentObj).then((comment) => {
        comment.dataValues.commenter = req.user;
        res.status(201).send(comment);
      }).catch((err) => {
        res.status(400).send({ errors: err.errors.map(error => error.message) });
      });
    });
  });

  // Assign a technician (by id or username) to a job (by id or name)
  app.post('/job/:job/assign/:technician', auth.hasRole(['Technician', 'Admin']), (req, res, next) => {
    db.Job.find({
      where: { $or: [{ id: req.params.job }, { name: req.params.job }] },
    }).then((job) => {
      if (!job) {
        return res.status(404).send(`Invalid job: ${req.params.job}`);
      }

      db.User.find({
        where: { $or: [{ id: req.params.technician }, { username: req.params.technician }] }
      }).then((tech) => {
        if (!tech) {
          return res.status(404).send(`Invalid technician: ${req.params.technician}`);
        }

        tech.addJob(job);
        res.status(202).send('Success.');
      }).catch(() => res.status(500).send('Internal server error.'));

    }).catch(() =>  res.status(500).send('Internal server error.'));
  });

  app.post('/job/:job/assign', auth.hasRole(['Technician', 'Admin']), (req, res, next) => {
    db.Job.find({
      where: { $or: [{ id: req.params.job }, { name: req.params.job }] },
    }).then((job) => {
      if (!job) {
        return res.status(404).send(`Invalid job: ${req.params.job}`);
      }

      req.user.addJob(job);
      res.status(202).send('Success.');
    }).catch(() => res.status(500).send('Internal server error.'));
  });

  // Unassign a technician (by id or username) from a job (by id or name)
  app.delete('/job/:job/assign/:technician', auth.hasRole(['Technician', 'Admin']), (req, res, next) => {
    db.Job.find({
      where: { $or: [{ id: req.params.job }, { name: req.params.job }] },
    }).then((job) => {
      if (!job) {
        return res.status(404).send(`Invalid job: ${req.params.job}`);
      }

      db.User.find({
        where: { $or: [{ id: req.params.technician }, { username: req.params.technician }] }
      }).then((tech) => {
        if (!tech) {
          return res.status(404).send(`Invalid technician: ${req.params.technician}`);
        }

        tech.removeJob(job);
        res.status(202).send('Success.');
      }).catch(() => res.status(500).send('Internal server error.'));

    }).catch(() => res.status(500).send('Internal server error.'));
  });
}

module.exports = RolesAPI;
