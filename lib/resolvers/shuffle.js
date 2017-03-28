'use strict';

const async     = require ('async')
  , _           = require ('underscore')
  , resolveThen = require ('./resolveThen')
  ;

function shuffle (values) {
  return function __dabShuffle (data, opts, callback) {
    resolveThen (values, data, opts, function (result, callback) {
      return callback (null, _.shuffle (result));
    }, callback);
  }
}

module.exports = shuffle;
