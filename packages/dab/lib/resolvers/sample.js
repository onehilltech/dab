'use strict';

const async     = require ('async')
  , _           = require ('underscore')
  , resolveThen = require ('./resolveThen')
  ;

function sample (values, n) {
  return function __dabSample (data, opts, callback) {
    resolveThen (values, data, opts, function (result, callback) {
      return callback (null, _.sample (result, n));
    }, callback);
  }
}

module.exports = sample;
