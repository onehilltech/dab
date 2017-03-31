'use strict';

const dab = require ('../lib');

module.exports = {
  users: dab.times (100, function (i, opts, callback) {
    const value = {username: 'user' + i, password: 'user' + i, age: dab.randomInt (21, 60)};
    return callback (null, value);
  }),

  comments: dab.times (10000, function (i, opts, callback) {
    var user = dab.ref (dab.sample (dab.get ('users')));
    var comment = {user: user, comment: 'This is comment ' + i};

    return callback (null, comment);
  }),

  likes: dab.sample (
    dab.map (dab.get ('users'), function (item, opts, callback) {
      var like = {user: item._id, comment: dab.sample (dab.get ('comments'))};
      return callback (null, like);
    }), dab.randomInt (50, 500))
};
