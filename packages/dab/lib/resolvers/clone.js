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

      let clone = _.clone (result);

      async.nextTick (function () {
        return callback (null, clone);
      });
    }, callback);
  }
}

module.exports = clone;
