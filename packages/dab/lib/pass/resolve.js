'use strict';

const async    = require ('async')
  , _          = require ('underscore')
  , objectPath = require ('object-path')
  ;

function resolve (opts, data) {
  return function __resolve (value, callback) {
    data = data || value;

    if (!_.isFunction (data.get))
      data = objectPath (data);

    resolveImpl (value, opts, data, callback);

    function resolveImpl (item, opts, data, callback) {
      if (_.isFunction (item)) {
        // The document docs is a function. This means we need to resolve it,
        // and run this again just in case any of the values contains a function.
        // resolved.
        async.waterfall ([
          function (callback) {
            item.call (null, data, opts, callback);
          },

          function (resolved, callback) {
            if (resolved) {
              return callback (null, resolved);
            }
            else if (resolved === undefined) {
              return callback (null, item);
            }
            else if (resolved === null) {
              return callback (null, null);
            }
            else {
              return callback (new Error ('Unknown value'));
            }
          }
        ], callback);
      }
      else if (_.isArray (item)) {
        async.map (item, function (value, callback) {
          return resolveImpl (value, opts, data, callback);
        }, callback);
      }
      else if (_.isObject (item)) {
        if (item.constructor === Object) {
          // We only want to map items that are hashes. Otherwise, we can assume
          // the item is an instance of an abstract data type.
          async.mapValues (item, function (value, key, callback) {
            return resolveImpl (value, opts, data, callback);
          }, callback);
        }
        else {
          return callback (null, item);
        }
      }
      else {
        return callback (null, item);
      }
    }
  };
}

module.exports = resolve;
