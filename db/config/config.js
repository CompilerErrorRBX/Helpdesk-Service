module.exports = {
  development: {
    username: process.env.HELPDESK_DEVELOPMENT_USERNAME ? process.env.HELPDESK_DEVELOPMENT_USERNAME : 'root',
    password: process.env.HELPDESK_DEVELOPMENT_PASSWORD ? process.env.HELPDESK_DEVELOPMENT_PASSWORD : null,
    database: 'Helpdesk_dev',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
  test: {
    username: 'root',
    password: null,
    database: 'Helpdesk_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.HELPDESK_PRODUCTION_USERNAME,
    password: process.env.HELPDESK_PRODUCTION_PASSWORD,
    database: 'Helpdesk_prod',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  }
}
