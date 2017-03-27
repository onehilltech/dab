'use strict';

const async    = require ('async')
  , _          = require ('underscore')
  , objectPath = require ('object-path')
  ;

function resolveImpl (opts, data, context, item, callback) {
  if (_.isFunction (item)) {
    // The document docs is a function. This means we need to resolve it,
    // and run this again just in case any of the values contains a function.
    // resolved.
    async.waterfall ([
      function (callback) {
        item.call (context, data, opts, callback);
      },

      function (resolved, callback) {
        if (resolved)
          resolveImpl (opts, data, context, resolved, callback);
        else if (resolved === undefined)
          return callback (null, item);
        else if (resolved === null)
          return callback (null, null);
        else
          return callback (new Error ('Unknown value'))
      }
    ], callback);
  }
  else if (_.isArray (item)) {
    async.map (item, function (entry, callback) {
      return resolveImpl (opts, data, null, entry, callback);
    }, callback);
  }
  else if (_.isObject (item)) {
    // We only want to map items that are hashes. Otherwise, we can assume
    // the item is an instance of an abstract data type.
    if (item.constructor === Object) {
      async.mapValues (item, function (value, key, callback) {
        return resolveImpl (opts, data, item, value, callback);
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

function resolve (opts, data) {
  return function __resolve (value, callback) {
    data = data || value;

    if (!_.isFunction (data.get))
      data = objectPath (data);

    return resolveImpl (opts, data, null, value, callback);
  };
}

module.exports = resolve;
