'use strict';

const _     = require ('underscore')
  , async   = require ('async')
  , resolve = require ('../pass/resolve')
  ;

function evaluate (value, data, opts, callback) {
  process.nextTick (function () {
    async.waterfall ([
      async.constant (value),
      resolve (opts, data),
      function (result, callback) {
        if (!_.isFunction (result))
          return callback (null, result);

        // The result of evaluating the current function is another
        // function. We need to evaluate this function as well until we
        // reach a reach a result that is not a function.
        evaluate (result, data, opts, callback);
      }
    ], callback);
  });
}

module.exports = evaluate;
