'use strict';

const async     = require ('async')
  , resolve     = require ('./phase/resolve')
  , _           = require ('underscore')
  , objectPath  = require ('object-path')
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
  async.waterfall ([
    /*
     * Run the first loop, which will let us know how we fared.
     */
    function (callback) {
      resolve (this._intermediate, this._intermediate, this._opts, callback);
    }.bind (this),

    /*
     * Resolve all the unresolved values.
     */
    function (result, unresolved, callback) {
      if (_.isEmpty (unresolved))
        return callback (null, result);

      ++ this._iteration;

      if (this._iteration >= this._maxIters)
        return callback (new Error ('reached max iterations'));

      // Prepare to resolve the unresolved.
      this._intermediate = result;
      this._unresolved = unresolved;

      async.doUntil (
        /*
         * Resolve the unresolved values.
         */
        function (callback) {
          function nextIter (callback) {
            return function (err) {
              if (err)
                return callback (err);

              // Advance to the next iteration.
              ++ this._iteration;

              // We always return the intermediate result.
              return callback (null, this._intermediate);
            }.bind (this);
          }

          async.eachOf (
            // The values we want to resolve. If things start to fail, we may have
            // to clone the unresolved hash before iterating over it.
            this._unresolved,

            function (item, key, callback) {
              async.waterfall ([
                /*
                 * Function that performs the resolve.
                 */
                function (callback) {
                  resolve (item, this._intermediate, this._opts, callback);
                }.bind (this),

                /*
                 * Function that handles the resolved value.
                 */
                function (result, unresolved, callback) {
                  if (result) {
                    objectPath.set (this._intermediate, key, result);
                    delete this._unresolved[key];
                  }
                  else if (!_.isEmpty (unresolved)) {
                    this._unresolved = _.merge (this._unresolved, unresolved);
                  }

                  return callback (null);
                }.bind (this)
              ], callback);
            }.bind (this),
            nextIter.call (this, callback));
        }.bind (this),

        /*
         * Check if we need to loop again.
         */
        function () {
          return _.isEmpty (this._unresolved) || this._iteration >= this._maxIters;
        }.bind (this),
        callback);
    }.bind (this)
  ], callback);
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
