'use strict';

const async  = require ('async')
  , _        = require ('underscore')
  , debug    = require ('debug') ('dab.map')
;

function map (values, func) {
  return function __dabMap (callback) {
     this.resolve (values, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      if (_.isArray (result)) {
        debug ('mapping an array of values (size=' + result.length + ')');

        async.map (result, function (value, callback) {
          func.call (this._data, value, this._opts, callback);
        }.bind (this), callback);
      }
      else if (_.isObject (result) && result.constructor === Object) {
        debug ('mapping an object (size=' + Object.keys (result).length + ')');

        async.mapValues (values, function (value, key, callback) {
          func.call (this._data, value, key, this._opts, callback);
        }, callback);
      }
      else {
        return callback (new Error ('values is an invalid type'));
      }
    }.bind (this), callback);
  }
}

module.exports = map;
