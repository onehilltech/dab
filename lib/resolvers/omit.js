'use strict';

const async  = require ('async')
  , _        = require ('underscore')
;

function omit (value, keys) {
  return function __dabOmit (callback) {
    this.resolve (value, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      let omit = _.omit (result, keys);

      async.nextTick (function () {
        return callback (null, omit);
      });
    }, callback);
  }
}

module.exports = omit;
