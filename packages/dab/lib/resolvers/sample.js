'use strict';

const _      = require ('underscore')
  , debug    = require ('debug')('dab:sample')
  , util     = require ('util')
  , evaluate = require ('./eval')
  ;

function sample (values, n) {
  return function __dabSample (data, opts, callback) {
    evaluate (values, data, opts, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      debug (util.format ('randomly selecting %d from %d', (n || 1), values.length));
      return callback (null, _.sample (result, n));
    }, callback);
  }
}

module.exports = sample;
