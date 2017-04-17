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

      return callback (null, _.keys (result));
    }, callback);
  }
}

module.exports = keys;
