'use strict';

const async  = require ('async')
  , _        = require ('underscore')
;

function clone (value) {
  return function __dabClone (callback) {
    this.resolve (value, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      return callback (null, _.clone (result));
    }, callback);
  }
}

module.exports = clone;
