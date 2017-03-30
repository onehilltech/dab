'use strict';

const async = require ('async')
  ;

function concat () {
  var arrays = [].slice.call (arguments);

  return function __dabConcat (callback) {
    async.concat (arrays,
      function (val, callback) {
        this.resolve (val, callback);
      }.bind (this),
      callback);
  }.bind (this);
}

module.exports = concat;
