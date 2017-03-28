'use strict';

const async     = require ('async')
  , _           = require ('underscore')
  , resolveThen = require ('./resolveThen')
;

function map (values, func) {
  return function __dabMap (data, opts, callback) {
    resolveThen (values, data, opts, function (result, callback) {
      if (_.isArray (values)) {
        async.map (values, function (value, callback) {
          func.call (data, value, opts, callback);
        }, callback);
      }
      else if (_.isObject (values) && values.constructor === Object) {
        async.mapValues (values, function (value, key, callback) {
          func.call (data, value, key, opts, callback);
        }, callback);
      }
      else {
        return callback (new Error ('values must be an array or object'));
      }
    }, callback);
  }
}

module.exports = map;
