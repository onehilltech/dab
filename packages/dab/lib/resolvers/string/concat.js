'use strict';

const async = require ('async');

function concat () {
  let values = [].slice.call (arguments);

  return function __dabStringConcat (callback) {
    this.resolve (values, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      let concat = String.prototype.concat.apply ('', result);

      async.nextTick (function () {
        return callback (null, concat);
      });
    });
  }
}

module.exports = concat;
