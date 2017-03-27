'use strict';

const async = require ('async')
  , _       = require ('underscore')
  , resolve = require ('../pass/resolve')
  ;

function shuffle (values) {
  return function __dabShuffle (data, opts, callback) {
    async.waterfall ([
      async.constant (values),
      resolve (opts, data),

      function (result, callback) {
        return callback (null, _.shuffle (result));
      }
    ], callback);
  }
}

module.exports = shuffle;
