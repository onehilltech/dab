'use strict';

const dab = require ('../lib');

module.exports = {
  users: dab.times (100, function (i, opts, callback) {
    const value = {username: 'user' + i, password: 'user' + i, age: dab.randomInt (21, 60)};
    return callback (null, value);
  }),

  comments: dab.times (1000, function (i, opts, callback) {
    let user = dab.ref (dab.sample (dab.get ('users')));
    let comment = {user: user, comment: 'This is comment ' + i};

    return callback (null, comment);
  }),

  likes: dab.sample (
    dab.map (dab.get ('users'), function (item, opts, callback) {
      let like = {user: item._id, comment: dab.sample (dab.get ('comments'))};
      return callback (null, like);
    }), dab.randomInt (50, 500))
};
