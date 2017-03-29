'use strict';

const async  = require ('async')
  , _        = require ('underscore')
  , evaluate = require ('./eval')
;

function map (values, func) {
  return function __dabMap (data, opts, callback) {
    evaluate (values, data, opts, function (err, result) {
      if (err)
        return callback (err);

      if (_.isArray (result)) {
        async.map (result, function (value, callback) {
          func.call (data, value, opts, callback);
        }, callback);
      }
      else if (_.isObject (result) && result.constructor === Object) {
        async.mapValues (values, function (value, key, callback) {
          func.call (data, value, key, opts, callback);
        }, callback);
      }
      else if (result === undefined) {
        // The mapping produced a function that cannot be resolved. We need to
        // return undefined to the caller.
        return callback (null, undefined);
      }
      else {
        return callback (new Error ('values is an invalid type'));
      }
    }, callback);
  }
}

module.exports = map;
