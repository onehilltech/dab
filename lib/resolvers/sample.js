'use strict';

const async  = require ('async')
  , _        = require ('underscore')
  , evaluate = require ('./eval')
  ;

function sample (values, n) {
  return function __dabSample (data, opts, callback) {
    evaluate (values, data, opts, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      return callback (null, _.sample (result, n));
    }, callback);
  }
}

module.exports = sample;
