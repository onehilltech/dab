'use strict';

const async     = require ('async')
  , resolveThen = require ('./resolveThen')
  ;

function filter (values, func) {
  return function __dabFilter (data, opts, callback) {
    resolveThen (values, data, opts, function (resolved, callback) {
      async.filter (resolved, function (value, callback) {
        func.call (data, value, opts, callback);
      }, callback);
    }, callback);
  }
}

module.exports = filter;
