'use strict';

const async = require ('async')
  , resolve = require ('../phase/resolve')
  ;

function concat () {
  var arrays = [].slice.call (arguments);

  return function __dabConcat (data, opts, callback) {
    async.concat (arrays, resolve (opts, data), callback);
  }
}

module.exports = concat;
