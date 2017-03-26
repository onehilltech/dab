'use strict';

const objectPath = require ('object-path')
  ;

function ref (path) {
  return function __ref (key, data, doc, opts, callback) {
    var target = objectPath.get (data, path);

    if (!target)
      return callback (null);

    var id = opts.id || '_id';
    return callback (null, target[id]);
  }
}

module.exports = ref;
