const argon2 = require('argon2');
const db = require('../../db/models');

class User {
  static create(userData) {
    return new Promise((resolve, reject) => {
      if (!userData.password) {
        reject({ errors: [{ message: 'Password cannot be null' }] });
        return;
      }
      if (userData.password.length < 8) {
        reject({ errors: [{ message: 'Password must be more than 8 characters' }] });
        return;
      }

      argon2.hash(userData.password, { type: argon2.argon2id }).then(hash => {
        db.Account.create({
          password: hash
        }).then((account) => {
          userData.accountId = account.id;
          db.User.create(userData).then((user) => {
            resolve(user);
          }).catch(err => reject(err));
        }).catch(err => reject(err));
      }).catch(() => reject({ errors: [{ message: 'Password cannot be null' }] }));
    });
  }
}

module.exports = User;
