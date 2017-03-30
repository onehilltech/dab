'use strict';

const async     = require ('async')
  , generateIds = require ('./phase/generateIds')
  , resolve     = require ('./phase/resolve')
  , _           = require ('underscore')
  , debug       = require ('debug') ('dab:build')
  , util        = require ('util')
  ;

const DEFAULT_MAX_ITERATIONS = 10;

function Builder (data, opts) {
  opts = opts || {};

  this._iteration = 1;
  this._unresolved = {};
  this._data = data;
  this._intermediate = this._data = data;
  this._maxIters = opts.maxIterations || DEFAULT_MAX_ITERATIONS;
  this._opts = opts;
}

/**
 * Build the current data model.
 *
 * @param callback
 */
Builder.prototype.build = function (callback) {
  async.doWhilst (
    function (callback) {
      debug ('building model (iteration ' + this._iteration + ')');

      async.waterfall ([
        async.constant (this._intermediate),
        generateIds (this._opts),
        resolve (this._opts),

        function (result, unresolved, callback) {
          this._unresolved = unresolved;

          if (!_.isEmpty (unresolved)) {
            // Set the current result as the data for the next iteration.
            debug ('unresolved references: ' + unresolved);
            debug ('intermediate: ' + util.inspect (result));

            this._intermediate = result;
          }

          // Move to the next iteration
          ++ this._iteration;

          if (this._iteration >= this._maxIters) {
            debug ('intermediate: ' + util.inspect (result));
            return callback (new Error ('reached max iterations'));
          }

          return callback (null, result);
        }.bind (this)
      ], callback);
    }.bind (this),

    function () {
      return this._unresolved === 0;
    }.bind (this),
    callback);
};

/**
 * Build a dab data model
 *
 * @param data          Dab data model
 * @param opts          Build options
 * @param callback      Callback object for result
 */
function build (data, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = { };
  }

  var builder = new Builder (data, opts);
  builder.build (callback);
}

module.exports = build;
