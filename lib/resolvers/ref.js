'use strict';

const _ = require ('underscore')
  ;

function ref (value) {
  return function __dabRef (callback) {
    this.resolve (value, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, undefined);

      const idKey = (this.opts.id || '_id');

      if (_.isString (result)) {
        const idPath = result + '.' + idKey;
        const id = this.data.get (idPath);

        if (_.isFunction (id)) {
          return callback (null, undefined);
        }
        else {
          return callback (null, id);
        }
      }
      else if (_.isObject (result)) {
        return callback (null, result[idKey]);
      }
    }.bind (this), callback);
  }
}

module.exports = ref;
