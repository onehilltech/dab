'use strict';

const async = require ('async')
  , debug   = require ('debug') ('dab:times')
  ;

function times (n, func) {
  return function __dabTimes (callback) {
    async.times (n, function (i, next) {
      debug ('generating item ' + i + ' of ' + n);
      process.nextTick (function () {
        func.call (this._data, i, this._opts, next);
      }.bind (this))
    }.bind (this), callback);
  }.bind (this);
}

module.exports = times;
