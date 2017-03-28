'use strict';

const async  = require ('async')
  , evaluate = require ('./eval')
  ;

function filter (values, func) {
  return function __dabFilter (data, opts, callback) {
    evaluate (values, data, opts, function (err, result) {
      if (err)
        return callback (err);

      async.filter (result, function (value, callback) {
        func.call (data, value, opts, callback);
      }, callback);
    }, callback);
  }
}

module.exports = filter;
