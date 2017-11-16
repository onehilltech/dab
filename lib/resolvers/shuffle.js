'use strict';

const async  = require ('async')
  , _        = require ('underscore')
  ;

function shuffle (values) {
  return function __dabShuffle (callback) {
    this.resolve (values, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      let shuffle = _.shuffle (result);

      async.nextTick (function () {
        return callback (null, shuffle);
      });
    }, callback);
  }
}

module.exports = shuffle;
