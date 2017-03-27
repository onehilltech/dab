'use strict';

function ref (path) {
  return function __dabRef (data, opts, callback) {
    var target = data.get (path);

    if (!target)
      return callback (null);

    var key = opts.id || '_id';
    return callback (null, target[key]);
  }
}

module.exports = ref;
