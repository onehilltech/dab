'use strict';

var async    = require ('async')
  , mongoose = require ('mongoose')
  ;

function clear (conn, models, callback) {
  if (!models) {
    callback = conn;
    conn = mongoose;
    models = [];
  }
  else if (!callback) {
    callback = models;
    models = [];
  }

  async.each (conn.models, function (Model, callback) {
    if (models.length !== 0 && models.indexOf (Model.modelName) === -1)
      return callback (null);

    Model.remove ({}, callback);
  }, callback);
}

module.exports = clear;
