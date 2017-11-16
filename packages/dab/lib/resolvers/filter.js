'use strict';

const async  = require ('async')
  ;

function filter (values, func) {
  return function __dabFilter (callback) {
    this.resolve (values, function (err, result) {
      if (err)
        return callback (err);

      if (result === undefined)
        return callback (null, result);

      async.filter (result, function (value, callback) {
        async.nextTick (function () {
          func.call (this._data, value, this._opts, callback);
        }.bind (this));
      }.bind (this), callback);
    }.bind (this), callback);
  }.bind (this)
}

module.exports = filter;
