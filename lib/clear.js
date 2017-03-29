'use strict';

var async    = require ('async')
  , mongoose = require ('mongoose')
  ;

function clear (models, conn, callback) {
  if (!conn) {
    callback = models;
    conn = mongoose;
  }
  else if (!callback) {
    callback = conn;
    conn = mongoose;
  }

  async.each (conn.models, function (Model, callback) {
    if (models.length === 0 || models.indexOf (Model.modelName) === -1)
      return callback (null);

    Model.remove ({}, callback);
  }, callback);
}

module.exports = clear;
