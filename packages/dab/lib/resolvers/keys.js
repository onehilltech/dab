'use strict';

const async  = require ('async')
  , _        = require ('underscore')
;

function keys (value) {
  return function __dabKeys (callback) {
    this.resolve (value, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      let keys = _.keys (result);

      async.nextTick (function () {
        return callback (null, keys);
      });
    }, callback);
  }
}

module.exports = keys;
