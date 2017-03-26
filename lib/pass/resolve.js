'use strict';

const async = require ('async')
  , _       = require ('underscore')
  ;

function resolve (opts) {
  return function __resolve (data, callback) {
    // The data is an object that maps model names to values.
    async.mapValues (data, function (docs, key, callback) {
      async.map (docs, function (doc, callback) {

        // If any value in the document is a function, then we need to
        // resolve it.
        async.mapValues (doc, function (value, key, callback) {
          if (!_.isFunction (value))
            return callback (null, value);

          value.call (null, key, data, doc, opts, callback);
        }, callback);
      }, callback);
    }, callback);
  };
}

module.exports = resolve;
