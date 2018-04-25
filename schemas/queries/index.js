const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const queries = {};

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const query = require(`./${file}`);
    queries[query.name] = query.query;
  });

module.exports = queries;
