'use strict';

const async = require ('async');

function times (n, func) {
  return function __dabTimes (data, opts, callback) {
    async.times (n, function (i, next) {
      func.call (data, i, opts, next);
    }, callback);
  }
}

module.exports = times;
