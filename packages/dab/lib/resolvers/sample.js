'use strict';

const _      = require ('underscore')
  , debug    = require ('debug')('dab:sample')
  , util     = require ('util')
  ;

function sample (values, n) {
  return function __dabSample (callback) {
    this.resolve (values, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      debug (util.format ('randomly selecting %d from %d', (n || 1), result.length));
      return callback (null, _.sample (result, n));
    }.bind (this), callback);
  }
}

module.exports = sample;
