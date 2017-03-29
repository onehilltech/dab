'use strict';

const async = require ('async')
  , debug   = require ('debug') ('dab:times')
  ;

function times (n, func) {
  return function __dabTimes (data, opts, callback) {
    async.times (n, function (i, next) {
      if (n % 100 === 0) {
        debug ('generating item ' + i + ' of ' + n);

        process.nextTick (function () {
          func.call (data, i, opts, next);
        });
      }
      else {
        func.call (data, i, opts, next);
      }
    }, callback);
  }
}

module.exports = times;
