'use strict';

const _     = require ('underscore')
  , async   = require ('async')
  , resolve = require ('../phase/resolve')
  ;

function evaluate (value, data, opts, callback) {
  process.nextTick (function () {
    async.waterfall ([
      async.constant (value),
      resolve (opts, data),
      function (result, unresolved, callback) {
        // The value was not resolved, so we need to return undefined to the
        // caller. This will let them know we need another iteration.
        if (unresolved)
          return callback (null, undefined);

        // We have a result, or we have a function that we need to evaluate.
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
