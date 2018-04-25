const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

let mutations = {};

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const mutation = require(`./${file}`);
    mutations = {
      ...mutations,
      ...mutation.mutation
    }
  });

module.exports = mutations;
