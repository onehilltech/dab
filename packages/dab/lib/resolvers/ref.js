'use strict';

function ref (path) {
  return function __dabRef (data, opts, callback) {
    var idPath = path + '.' + (opts.id || '_id');
    var value = data.get (idPath);

    return callback (null, value);
  }
}

module.exports = ref;
