'use strict';

const async  = require ('async')
  , _        = require ('underscore')
  , resolver = require ('./resolver')
;

function map (values, f) {
  return function __dabMap (data, opts, callback) {
    resolver (values, data, opts, function (result, callback) {
      if (_.isArray (result)) {
        async.map (result, function (value, callback) {
          resolver (value, data, opts, function (result, callback) {
            return f.call (null, result, data, opts, callback);
          }, callback);
        }, callback);
      }
      else if (_.isObject (result) && result.constructor === Object) {
        async.mapValues (result, function (value, key, callback) {
          resolver (value, data, opts, function (val, callback) {
            return f.call (result, val, data, opts, callback);
          }, callback);
        }, callback);
      }
      else {
        return f.call (null, result, data, opts, callback);
      }
    }, callback);
  }
}

module.exports = map;
