'use strict';

function get (path) {
  return function __dabGet (data, opts, callback) {
    var value = data.get (path);
    return callback (null, value);
  }
}

module.exports = get;
