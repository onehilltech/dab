'use strict';

const _      = require ('underscore')
  , evaluate = require ('./eval')
  ;

function ref (value) {
  return function __dabRef (data, opts, callback) {
    evaluate (value, data, opts, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      if (_.isString (result)) {
        const idPath = result + '.' + (opts.id || '_id');
        const id = data.get (idPath);

        return callback (null, id);
      }
      else if (_.isObject (result)) {
        var idKey = (opts.id || '_id');
        return callback (null, result[idKey]);
      }
    }, callback);
  }
}

module.exports = ref;
