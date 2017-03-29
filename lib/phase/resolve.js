'use strict';

const async    = require ('async')
  , _          = require ('underscore')
  , objectPath = require ('object-path')
  ;

function resolve (opts, data) {
  var unresolved = 0;

  return function __resolve (value, callback) {
    data = data || value;

    if (!_.isFunction (data.get))
      data = objectPath (data);

    async.waterfall ([
      function (callback) {
        processItem (value, opts, data, callback);
      },

      function (result, callback) {
        return callback (null, result, unresolved);
      }
    ], callback);

    function processItem (item, opts, data, callback) {
      if (_.isFunction (item)) {
        // The document docs is a function. This means we need to resolve it,
        // and run this again just in case any of the values contains a function.
        // resolved.
        async.waterfall ([
          function (callback) {
            item.call (null, data, opts, callback);
          },

          function (result, callback) {
            if (result) {
              process.nextTick (function () {
                __resolve (result, function (err, resolved, unresolved) {
                  if (err) {
                    return callback (err);
                  }
                  else if (unresolved) {
                    ++ unresolved;
                    return callback (null, result);
                  }
                  else {
                    return callback (null, resolved);
                  }
                });
              });
            }
            else if (result === undefined) {
              ++ unresolved;
              return callback (null, item);
            }
            else if (result === null) {
              return callback (null, null);
            }
            else {
              return callback (new Error ('Unknown value'));
            }
          }
        ], callback);
      }
      else if (_.isArray (item)) {
        process.nextTick (function () {
          async.map (item, function (value, callback) {
              processItem (value, opts, data, callback);
          }, callback);
        });
      }
      else if (_.isObject (item) && item.constructor === Object) {
        // We only want to map items that are hashes. Otherwise, we can assume
        // the item is an instance of an abstract data type.
        process.nextTick (function () {
          async.mapValues (item, function (value, key, callback) {
              processItem (value, opts, data, callback);
          }, callback);
        });
      }
      else {
        return callback (null, item);
      }
    }
  };
}

module.exports = resolve;
