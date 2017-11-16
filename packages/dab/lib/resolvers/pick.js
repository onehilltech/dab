'use strict';

const async  = require ('async')
  , _        = require ('underscore')
;

function pick (value, keys) {
  return function __dabPick (callback) {
    this.resolve (value, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      let pick = _.pick (result, keys);

      async.nextTick (function () {
        return callback (null, pick);
      });
    }, callback);
  }
}

module.exports = pick;
