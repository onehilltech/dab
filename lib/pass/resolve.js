'use strict';

const async    = require ('async')
  , _          = require ('underscore')
  , objectPath = require ('object-path')
  ;

function resolveImpl (opts, data, context, item, callback) {
  if (_.isFunction (item)) {
    // The document docs is a function. This means we need to resolve it,
    // and run this again just in case any of the values contains a function.
    // resolved
    item.call (context, objectPath (data), opts, callback);
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

function resolve (opts) {
  return function __resolve (data, callback) {
    return resolveImpl (opts, data, null, data, callback);
  };
}

module.exports = resolve;
