'use strict';

function ref (path) {
  return function __ref (data, opts, callback) {
    var target = data.get (path);

    if (!target)
      return callback (null);

    var id = opts.id || '_id';
    return callback (null, target[id]);
  }
}

module.exports = ref;
