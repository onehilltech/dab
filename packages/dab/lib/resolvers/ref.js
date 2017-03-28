'use strict';

const _         = require ('underscore')
  , resolveThen = require ('./resolveThen')
  ;

function ref (value) {
  return function __dabRef (data, opts, callback) {
    resolveThen (value, data, opts, function (resolved, callback) {
      if (_.isString (resolved)) {
        const idPath = resolved + '.' + (opts.id || '_id');
        const id = data.get (idPath);

        return callback (null, id);
      }
      else if (_.isObject (resolved)) {
        var idKey = (opts.id || '_id');
        return callback (null, resolved[idKey]);
      }
    }, callback);
  }
}

module.exports = ref;
