'use strict';

const async = require ('async')
  , resolve = require ('../pass/resolve')
  ;

function filter (values, f) {
  return function __dabFilter (data, opts, callback) {
    async.waterfall ([
      async.constant (values),
      resolve (opts, data),

      function (result, callback) {
        async.filter (result, function (value, callback) {
          f.call (null, value, data, opts, callback);
        }, callback);
      }
    ], callback);
  }
}

module.exports = filter;
