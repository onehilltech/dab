'use strict';

function get (path) {
  return function __dabGet (data, opts, callback) {
    return callback (null, data.get (path));
  }
}

module.exports = get;
