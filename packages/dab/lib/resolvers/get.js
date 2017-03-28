'use strict';

function get (path) {
  return function __dabGet (data, opts, callback) {
    const value = data.get (path);
    return callback (null, value);
  }
}

module.exports = get;
