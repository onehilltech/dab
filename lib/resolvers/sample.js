'use strict';

const async = require ('async')
  , _       = require ('underscore')
  , resolve = require ('../pass/resolve')
  ;

function sample (values, n) {
  return function __dabSample (data, opts, callback) {
    async.waterfall ([
      async.constant (values),
      resolve (opts, data),

      function (result, callback) {
        return callback (null, _.sample (result, n));
      }
    ], callback);
  }
}

module.exports = sample;
