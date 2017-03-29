'use strict';

const async     = require ('async')
  , generateIds = require ('./phase/generateIds')
  , resolve     = require ('./phase/resolve')
  ;

function build (data, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = { };
  }

  const maxIterations = opts.maxIterations || 2;

  var complete = false;
  var iteration = 0;

  async.doWhilst (
    function (callback) {
      async.waterfall ([
        async.constant (data),
        generateIds (opts),
        resolve (opts),

        function (result, unresolved, callback) {
          if (unresolved === 0)
            complete = true;

          // Move to the next iteration.
          ++ iteration;

          if (iteration >= maxIterations)
            return callback (new Error ('reached max iterations'));

          return callback (null, result);
        }
      ], callback);
    },

    function () {
      return !complete;
    },
    callback);
}

module.exports = build;
