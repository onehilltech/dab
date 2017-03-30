'use strict';

const async = require ('async')
  , debug   = require ('debug') ('dab:times')
  ;

function times (n, func) {
  return function __dabTimes (callback) {
    async.times (n, function (i, next) {
      if (i % 100 === 0)
        debug ('generating item ' + i + ' of ' + n);

      func.call (this._data, i, this._opts, next);
    }.bind (this), callback);
  }.bind (this);
}

module.exports = times;
