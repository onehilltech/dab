'use strict';

const async  = require ('async')
  , _        = require ('underscore')
  , evaluate = require ('./eval')
  ;

function shuffle (values) {
  return function __dabShuffle (data, opts, callback) {
    evaluate (values, data, opts, function (err, result) {
      if (err)
        return callback (err);

      return callback (null, _.shuffle (result));
    }, callback);
  }
}

module.exports = shuffle;
