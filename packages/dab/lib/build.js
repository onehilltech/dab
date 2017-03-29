'use strict';

const async     = require ('async')
  , generateIds = require ('./phase/generateIds')
  , resolve     = require ('./phase/resolve')
  , debug       = require ('debug') ('dab:build')
  , util        = require ('util')
  ;

const DEFAULT_MAX_ITERATIONS = 10;

function build (data, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = { };
  }

  const maxIterations = opts.maxIterations || DEFAULT_MAX_ITERATIONS;

  var complete = false;
  var iteration = 0;
  var curr = data;

  async.doWhilst (
    function (callback) {
      debug ('building model (iteration ' + (iteration + 1) + ')');

      async.waterfall ([
        async.constant (curr),
        generateIds (opts),
        resolve (opts),

        function (result, unresolved, callback) {
          if (unresolved === 0) {
            complete = true;
          }
          else {
            // Set the current result as the data for the next iteration.
            debug ('unresolved references: ' + unresolved);
            debug ('intermediate: ' + util.inspect (result));

            curr = result;
          }

          // Move to the next iteration
          ++ iteration;

          if (iteration >= maxIterations) {
            debug ('intermediate: ' + util.inspect (result));
            return callback (new Error ('reached max iterations'));
          }

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
