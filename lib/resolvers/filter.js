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
        func.call (this.data, value, this.opts, callback);
      }.bind (this), callback);
    }.bind (this), callback);
  }.bind (this)
}

module.exports = filter;
