'use strict';

var ObjectId = require ('mongoose').Types.ObjectId;

function id (value) {
  return function __dabId (callback) {
    return callback (null, new ObjectId (value));
  }
}

module.exports = id;
