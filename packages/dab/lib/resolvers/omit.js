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

      return callback (null, _.omit (result, keys));
    }, callback);
  }
}

module.exports = omit;
