'use strict';

const async = require ('async');

function times (n, f) {
  return function __dabTimes (data, opts, callback) {
    async.times (n, function (n, next) {
      f.call ({index: n}, data, opts, next);
    }, callback);
  }
}

module.exports = times;
